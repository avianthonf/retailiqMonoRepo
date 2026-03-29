# RetailIQ Android Final Parity Checklist

Status: build-green, core operator flows live, long-tail backend modules are now live-backed, and the remaining work is final device smoke-testing and edge-case polish.

## Goal
Make `retailiq-android0frontend` feel complete on-device, with no obvious demo content, no placeholder screens, and no backend area left without a usable Android surface.

## Step 1: Close long-tail backend modules
Context:
- The core shell, auth, dashboard, inventory, POS, analytics, assistant, scanner, customers, suppliers, forecasting, receipts, developer, and system flows are live.
- Remaining backend areas still need dedicated mobile surfaces or stronger live summaries.

Work:
- Wire live module summaries for `GST`, `Loyalty`, `Credit`, `KYC`, `Marketplace`, `Chain`, `Pricing`, `Decisions`, `E-Invoicing`, `Events`, `WhatsApp`, `Staff Performance`, and `Offline`.
- Use the existing backend prefixes already present in the module catalog.
- Prefer thin, readable cards with live counts, status chips, and 1-2 operator actions per module.

Exit criteria:
- Every module tile opens a meaningful live or backend-backed detail screen.
- No module route falls back to a generic placeholder shell.

## Step 2: Tighten empty states and offline states
Context:
- Offline and fallback behavior should read like a deliberate product decision, not sample code.

Work:
- Replace any remaining sample-style default values with neutral fallback copy.
- Keep all offline states concise and explicit.
- Make sure every fallback state still explains what the operator can do next.

Exit criteria:
- No visible demo credentials, demo labels, or placeholder copy remain in the UI.
- Offline states are understandable and useful.

## Step 3: Complete device-flow parity
Context:
- The app now reaches the backend for assistant queries, OCR upload, shelf scan, and receipt digitization.

Work:
- Validate scanner upload, shelf scan, and receipt analysis on a real device.
- Add device-safe error messages for camera/file selection failures.
- Confirm navigation from inventory and POS into scanner flows.

Exit criteria:
- Scanner flows work end-to-end on device.
- Errors are recoverable without restarting the app.

## Step 4: Add release-focused test coverage
Context:
- Unit tests already protect repository fallbacks and session persistence.

Work:
- Add Compose tests for auth, dashboard, assistant response rendering, and scanner launch states.
- Add repository tests for the remaining module summaries as they are wired.
- Keep the build gate at `assembleDebug` + `testDebugUnitTest`.

Exit criteria:
- New screens and adapters have regression coverage.
- No compile warnings or failing tests on the release path.

## Step 5: Final release hardening
Context:
- The app is close to release-ready, but parity needs one last verification pass.

Work:
- Run a final manual smoke test across every top-level destination.
- Confirm back navigation, sign-out, and route restoration.
- Verify the app launches cleanly with and without a backend URL.

Exit criteria:
- The app can be handed to a tester with a clear checklist and no known blocker in the main paths.

## Current verification
- `testDebugUnitTest`
- `assembleDebug`

Both pass on the current machine with the installed Android Studio JBR and local Gradle distribution.
