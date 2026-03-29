# RetailIQ Android Backend Deepening Roadmap

## Objective
Take the current Compose frontend from a seeded operator shell to a production-grade Android client that can persist sessions, talk to the backend safely, and cover the remaining operational modules without regressing the build.

## Current Baseline
- The Android app already builds with Gradle and passes unit tests.
- Auth, dashboard, inventory, POS, analytics, scanner, and several backend module shells exist.
- Store, customer, supplier, forecasting, receipts, developer, and system surfaces are present but still seeded.
- Live backend access is optional today and only partially wired.

## Dependency Graph
1. Session persistence and token refresh are the foundation for authenticated API work.
2. Safe remote loading must be in place before converting seeded module screens to live data.
3. Scanner and vision work depend on the app shell and runtime permissions flow, but not on live camera models.
4. Instrumentation tests should land after navigation and screen contracts stabilize.

## Step 1: Secure Session Persistence
Context:
The app currently keeps authentication in memory only. That is fine for development, but it breaks process death recovery and makes refresh-token handling fragile.

Scope:
- Add an encrypted or otherwise secure session store for access and refresh tokens.
- Restore session state on app start.
- Add refresh-token retry handling when the backend returns token-expired responses.
- Keep the UI state object immutable; write new copies rather than mutating.

Target files:
- `app/src/main/java/com/retailiq/android/feature/shell/RetailIqAppViewModel.kt`
- `app/src/main/java/com/retailiq/android/core/data/RetailIqRepository.kt`
- new `core/session/` or `core/security/` helpers

Exit criteria:
- Auth state survives process recreation in the intended storage path.
- Failed access-token requests can recover via refresh without bouncing the user to login.
- Existing tests still pass.

Verification:
- `gradle testDebugUnitTest --no-daemon`
- `gradle assembleDebug --no-daemon`

## Step 2: Live Backend Wiring For Core Surfaces
Context:
The most valuable user-facing modules are store admin, customer center, supplier center, forecasting, receipts, developer console, and system status. They should use live endpoints when available and fall back to seeded data when offline or when the backend is unavailable.

Scope:
- Add API interfaces for store, customers, suppliers, forecasting, receipts, developer, and system/health routes.
- Use tolerant remote loading so transient backend failures do not break the app shell.
- Convert repository methods to combine remote payloads into the existing snapshot models.
- Keep seeded fallback data intact as the offline and demo path.

Target files:
- `app/src/main/java/com/retailiq/android/core/network/RetailIqApi.kt`
- `app/src/main/java/com/retailiq/android/core/data/RetailIqRepository.kt`
- `app/src/main/java/com/retailiq/android/core/model/BackendSurfaces.kt`

Exit criteria:
- Store, customers, suppliers, forecasting, receipts, developer, and system screens render remote data when the backend is reachable.
- Seeded fallback still works when the backend is absent or returns an error.
- The app remains buildable on the current SDK/toolchain.

Verification:
- `gradle testDebugUnitTest --no-daemon`
- `gradle assembleDebug --no-daemon`

## Step 3: Scanner And Vision Capture
Context:
The scanner screen is currently a placeholder. The next useful expansion is a real capture flow for barcode, shelf, and receipt assets, even if the initial implementation is camera-preview plus upload plumbing rather than full OCR.

Scope:
- Add camera permission handling.
- Add a capture state model for barcode, shelf, and receipt modes.
- Wire the scanner entry point into inventory and POS actions.
- Add a placeholder vision review path that can later consume OCR results.

Target files:
- `app/src/main/java/com/retailiq/android/feature/operations/OperationsScreens.kt`
- new `feature/vision/` or `feature/scanner/` files
- `app/src/main/AndroidManifest.xml`

Exit criteria:
- The scanner destination is no longer just a static card.
- Inventory/POS can deep link into the capture surface.
- Permission denial and unavailable camera states are handled gracefully.

Verification:
- `gradle assembleDebug --no-daemon`
- instrumented smoke test on a device or emulator

## Step 4: Instrumented Navigation And Surface Tests
Context:
The app shell is now large enough that navigation regressions and route drift matter more than isolated UI snapshots.

Scope:
- Add compose tests for the top-level tabs and the operations hub.
- Add navigation tests for the new module-detail routes.
- Add one or two critical auth/session tests for the restored-session path.
- Keep tests small and focused on route contracts.

Target files:
- `app/src/androidTest/java/...`
- `app/src/test/java/...`

Exit criteria:
- Core routes are locked by tests.
- The new module surfaces cannot be removed or renamed accidentally without a test failure.

Verification:
- `gradle testDebugUnitTest --no-daemon`
- `gradle connectedDebugAndroidTest --no-daemon` when a device is available

## Step 5: Hardening And Documentation
Context:
Once the live wiring is stable, the last pass should tighten the UX and document the remaining operational limits.

Scope:
- Clean up any placeholder copy.
- Add README notes for auth storage, backend configuration, and release-time expectations.
- Remove dead code or unused scaffold artifacts.
- Re-run full build verification.

Exit criteria:
- README matches the shipped behavior.
- No unresolved placeholder paths remain in the core shell.
- Build and tests stay green.

## Parallelism Summary
- Step 1 must complete before Step 2 if live API auth needs refresh handling.
- Step 3 can start after the shell and permissions strategy are settled.
- Step 4 can run alongside the tail end of Step 2 or Step 3 once routes stabilize.
- Step 5 should happen after the rest of the work is merged.

## Anti-Patterns To Avoid
- Do not replace the seeded fallback path with live-only calls.
- Do not mutate session or UI state in place.
- Do not add a second navigation system.
- Do not block the build on unfinished camera work.

