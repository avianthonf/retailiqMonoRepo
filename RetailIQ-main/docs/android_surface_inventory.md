# RetailIQ Android Surface Inventory

Inventory derived from:

- `retailiq-android0frontend/app/src/main/java/com/retailiq/android/core/network/RetailIqApi.kt`
- `retailiq-android0frontend/app/src/main/java/com/retailiq/android/core/data/RetailIqRepository.kt`
- `retailiq-android0frontend/app/src/main/java/com/retailiq/android/core/model/Models.kt`
- `retailiq-android0frontend/app/src/main/java/com/retailiq/android/feature/operations/*.kt`

## Transport Rules

- Debug builds must resolve a real backend host.
- `RetailIqRepository.create(context)` is the live app path and must not silently fall back to demo payloads.
- `RetailIqRepository.create()` remains an in-memory/demo path for non-production usage and tests.
- Backend failures should be rendered explicitly in Compose screens, not masked as empty content.

## Base URL And Diagnostics

- Debug fallback host:
  - Emulator: `http://10.0.2.2:5000`
  - Physical device: `http://127.0.0.1:5000`
    - Intended for use with `adb reverse tcp:5000 tcp:5000` during local device demos.
- Health endpoints:
  - `GET /health`
  - `GET /api/v1/team/ping`
  - `GET /api/v1/ops/maintenance`

## Retrofit Surface Inventory

- Auth
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
- Dashboard
  - `GET /api/v1/dashboard/overview`
  - `GET /api/v1/dashboard/alerts`
  - `GET /api/v1/dashboard/live-signals`
  - `GET /api/v1/dashboard/forecasts/stores`
  - `GET /api/v1/dashboard/incidents/active`
  - `GET /api/v1/dashboard/alerts/feed`
- Inventory
  - `GET /api/v1/inventory`
  - `GET /api/v1/inventory/{productId}`
  - `POST /api/v1/inventory/{productId}/stock-update`
  - `POST /api/v1/inventory/{productId}/stock`
  - `POST /api/v1/inventory/stock-audit`
  - `POST /api/v1/inventory/audit`
  - `GET /api/v1/inventory/{productId}/price-history`
  - `GET /api/v1/inventory/alerts`
- Customers
  - `GET /api/v1/customers`
  - `GET /api/v1/customers/{customerId}`
  - `GET /api/v1/customers/{customerId}/summary`
  - `GET /api/v1/customers/{customerId}/transactions`
  - `GET /api/v1/customers/top`
  - `GET /api/v1/customers/analytics`
- Suppliers
  - `GET /api/v1/suppliers`
  - `GET /api/v1/suppliers/{supplierId}`
  - `GET /api/v1/suppliers/{supplierId}/products`
  - `POST /api/v1/suppliers`
  - `PUT /api/v1/suppliers/{supplierId}`
  - `DELETE /api/v1/suppliers/{supplierId}`
- Transactions
  - `GET /api/v1/transactions/summary/daily`
  - `GET /api/v1/transactions`
- Analytics
  - `GET /api/v1/analytics/dashboard`
- Forecasting
  - `GET /api/v1/forecasting/store`
  - `GET /api/v1/forecasting/sku/{productId}`
  - `GET /api/v1/forecasting/demand-sensing/{productId}`
- Store
  - `GET /api/v1/store/profile`
  - `GET /api/v1/store/categories`
  - `GET /api/v1/store/tax-config`
- Receipts
  - `GET /api/v1/receipts/template`
  - `PUT /api/v1/receipts/template`
  - `POST /api/v1/receipts/print`
  - `GET /api/v1/receipts/print/{jobId}`
- Vision
  - `POST /api/v1/vision/ocr/upload`
  - `GET /api/v1/vision/ocr/{jobId}`
  - `POST /api/v1/vision/ocr/{jobId}/confirm`
  - `POST /api/v1/vision/ocr/{jobId}/dismiss`
  - `POST /api/v1/vision/shelf-scan`
  - `POST /api/v1/vision/receipt`
- Developer
  - `POST /api/v1/developer/register`
  - `GET /api/v1/developer/apps`
  - `POST /api/v1/developer/apps`
  - `PATCH /api/v1/developer/apps/{appRef}`
  - `DELETE /api/v1/developer/apps/{appRef}`
  - `POST /api/v1/developer/apps/{appRef}/regenerate-secret`
  - `GET /api/v1/developer/webhooks`
  - `POST /api/v1/developer/webhooks`
  - `PATCH /api/v1/developer/webhooks/{appRef}`
  - `DELETE /api/v1/developer/webhooks/{appRef}`
  - `POST /api/v1/developer/webhooks/{appRef}/test`
  - `GET /api/v1/developer/usage`
  - `GET /api/v1/developer/rate-limits`
  - `GET /api/v1/developer/logs`
  - `GET /api/v1/developer/marketplace`
- Long-tail live module support
  - Barcodes: `/api/v1/barcodes/lookup`, `/api/v1/barcodes/list`
  - GST: `/api/v1/gst/*`
  - Loyalty: `/api/v1/loyalty/*`
  - Finance/Credit: `/api/v2/finance/*`
  - KYC: `/api/v1/kyc/kyc/*`
  - I18N: `/api/v1/i18n/i18n/*`
  - Market: `/api/v1/market/*`
  - Marketplace: `/api/v1/marketplace/*`
  - Chain: `/api/v1/chain/*`
  - Pricing: `/api/v1/pricing/*`
  - Tax: `/api/v1/tax/*`
  - AI V2: `/api/v2/ai/*`
  - Decisions: `/api/v1/decisions`
  - E-Invoicing: `/api/v2/einvoice/*`
  - Events: `/api/v1/events/*`
  - WhatsApp: `/api/v1/whatsapp/*`
  - Staff: `/api/v1/staff/*`
  - Offline: `/api/v1/offline/snapshot`

## Android Module Catalog

- dashboard
- inventory
- transactions
- analytics
- barcodes
- store
- customers
- suppliers
- forecasting
- gst
- loyalty
- credit
- kyc
- i18n
- market
- receipts
- vision
- ops
- tax
- finance
- ai
- whatsapp
- events
- marketplace
- chain
- pricing
- decisions
- einvoicing
- staff
- developer
- system
- offline

## Mobile Surfaces Bound To Live Repository Calls

- Top-level destinations
  - Dashboard
  - Inventory
  - POS
  - Analytics
  - AI Assistant
- Operations hub detail screens
  - Store Admin
  - Customer Center
  - Supplier Center
  - Forecasting
  - Receipts
  - Developer Console
  - System Status
- All of the above now use explicit loading and explicit error states for backend-backed data.

## Verified Alignment Notes

- `system.backendPrefix` is `/health`
- `ops.backendPrefix` is `/api/v1/ops`
- `developer.backendPrefix` is `/api/v1/developer/apps`
- Core mobile-first live surfaces now include:
  - `dashboard`
  - `inventory`
  - `transactions`
  - `analytics`
- `staff.backendPrefix` is `/api/v1/staff`
- AI v2 keeps raw response parsing for:
  - `POST /api/v2/ai/nlp/query`
  - `POST /api/v2/ai/recommend`

## Coverage Status

No backend family remains unaccounted for in Android.

Families intentionally subsumed rather than exposed as separate module names:

- auth
  - Covered by auth entry panels and live auth transport.
- team
  - Covered by the system diagnostics surface.
- purchase-orders
  - Covered within supplier operations because the workflow is vendor-adjacent in the Android shell.
