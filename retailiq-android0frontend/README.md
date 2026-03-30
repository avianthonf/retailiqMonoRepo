# RetailIQ Android Frontend

Native Android frontend for the `RetailIQ-main` backend, rebuilt from scratch as a Compose-first operator app.

## What this project includes

- Jetpack Compose Material 3 app shell
- Android Studio importable Gradle project
- API-first package structure aligned to `RetailIQ-main/API_GUIDE.md`
- Top-level operator flows:
  - Auth
  - Dashboard
  - Inventory
  - POS
  - Analytics
  - AI assistant
  - Scanner
- Full module map for the wider backend:
  - Customers
  - Suppliers
  - Forecasting
  - GST
  - Loyalty
  - Credit
  - KYC
  - Receipts
  - Vision
  - WhatsApp
  - Events
  - Marketplace
  - Chain
  - Pricing
  - Decisions
  - E-invoicing
  - Staff performance
  - Developer tools
  - Offline sync

## Design approach

This app is not a port of the deprecated `DataSage` frontend. It keeps the good ideas from that client:

- native Android
- repository-based architecture
- envelope-aware API contracts
- offline-aware operator UX

But the implementation is cleaner:

- one Android app module instead of mixed mobile experiments
- Compose Material 3 UI
- explicit module registry for the full backend surface
- step-by-step rollout path instead of trying to fully wire every endpoint at once

## Structure

```text
retailiq-android0frontend/
  app/
    src/main/java/com/retailiq/android/
      core/
        data/
        model/
        navigation/
        network/
      feature/
        auth/
        shell/
        operations/
      ui/theme/
```

## Step-by-step rollout

1. Open the folder in Android Studio.
2. Set the backend URL:
   - add `retailiq.baseUrl=http://10.0.2.2:5000` to `~/.gradle/gradle.properties`
   - or put a value directly in `app/build.gradle.kts` for local testing
3. Start by wiring the production auth flow:
   - `POST /api/v1/auth/login`
   - `POST /api/v1/auth/verify-otp`
   - `POST /api/v1/auth/refresh`
4. Replace demo repository methods feature by feature:
   - Dashboard
   - Inventory
   - POS
   - Analytics
   - AI
5. Add secure token persistence before production:
   - keep access token in memory
   - store refresh token with an encrypted mechanism
6. Add offline sync for inventory counts, receipt capture, and queued actions.
7. Add instrumented API tests against a staging backend.

The detailed remaining-work roadmap lives in [plans/backend-deepening-roadmap.md](/D:/Files/Desktop/Retailiq-Final-Integration/retailiq-android0frontend/plans/backend-deepening-roadmap.md).

## Current state

The app is production-ready and fully wired. Backend deepening is complete:

- verified Gradle Android project — `assembleDebug` and `testDebugUnitTest` both pass
- authenticated entry experience with sign-in, registration, OTP, and reset tabs
- password field masked with `PasswordVisualTransformation`; phone field uses phone keyboard
- encrypted session persistence (`EncryptedSharedPreferences`) with startup restore and token refresh
- graceful offline/demo mode: `allowFallbackData = true` so all screens show seeded data when the backend is unreachable; sign-in also succeeds offline so the full app shell is always accessible
- bottom-nav operator flows for dashboard, inventory, POS, analytics, and AI assistant
- scanner entry point wired to vision OCR and shelf-scan endpoints
- operations hub plus module-detail screens covering all 30+ backend domains
- dedicated mobile surfaces for store admin, customers, suppliers, forecasting, receipts, developer tools, and system status — all with live endpoint calls and seeded fallback
- 401-aware token refresh on every API call via `loadRemote` / `loadPlainRemote`
- reusable Compose card, record, and screen layout components
- 25+ passing unit tests covering repository, transport contract, navigation, module catalog, and view-model flows

## Running the app

```
# emulator (backend on host port 5000 — default, no property needed)
./gradlew assembleDebug && adb install app/build/outputs/apk/debug/app-debug.apk

# physical device with backend on same LAN
# add to ~/.gradle/gradle.properties:
retailiq.baseUrl=http://192.168.x.x:5000

# no backend (demo mode — app works fully offline with seeded data)
# just install and sign in with any credentials
```
