# RetailIQ API Contract

Canonical backend contract derived from `RetailIQ-main/app/__init__.py`, `RetailIQ-main/app/**/routes.py`, and `RetailIQ-main/tests/test_frontend_backend_contracts.py`.

## Contract Rules

- Backend route code wins over frontend assumptions.
- Alias routes are part of the contract and must stay explicit.
- Response shape matters:
  - Many routes return `ApiEnvelope<T>` as `{ success, data, error, meta }`.
  - Some operational routes intentionally return raw JSON objects or arrays.
- Android should not replace a live backend route with seeded/demo data in the production app path.

## Root And Diagnostics

- `GET /health`
  - Raw response, not envelope.
  - Used by Android `system` surface.
- `GET /api/v1/team/ping`
  - Team reachability probe.
- `GET /api/v1/ops/maintenance`
  - Operations maintenance and incident status.

## Registered Backend Families

- `/api/v1/analytics`
- `/api/v1/auth`
- `/api/v1/barcodes`
- `/api/v1/chain`
- `/api/v1/customers`
- `/api/v1/dashboard`
- `/api/v1/decisions`
- `/api/v1/developer`
- `/api/v1/events`
- `/api/v1/forecasting`
- `/api/v1/gst`
- `/api/v1/i18n`
- `/api/v1/inventory`
- `/api/v1/kyc`
- `/api/v1/loyalty`
- `/api/v1/credit`
- `/api/v1/market`
- `/api/v1/marketplace`
- `/api/v1/nlp`
- `/api/v1/offline`
- `/api/v1/ops`
- `/api/v1/pricing`
- `/api/v1/purchase-orders`
- `/api/v1/receipts`
- `/api/v1/staff`
- `/api/v1/store`
- `/api/v1/suppliers`
- `/api/v1/tax`
- `/api/v1/team`
- `/api/v1/transactions`
- `/api/v1/vision`
- `/api/v1/whatsapp`
- `/api/v2/ai`
- `/api/v2/einvoice`
- `/api/v2/finance`

## Android-Critical Canonical Routes

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
  - `GET /api/v1/inventory/{product_id}`
  - `POST /api/v1/inventory/{product_id}/stock-update`
  - `POST /api/v1/inventory/{product_id}/stock`
  - `POST /api/v1/inventory/stock-audit`
  - `POST /api/v1/inventory/audit`
  - `GET /api/v1/inventory/{product_id}/price-history`
  - `GET /api/v1/inventory/alerts`
- Customers
  - `GET /api/v1/customers`
  - `GET /api/v1/customers/top`
  - `GET /api/v1/customers/analytics`
  - `GET /api/v1/customers/{customer_id}`
  - `GET /api/v1/customers/{customer_id}/transactions`
  - `GET /api/v1/customers/{customer_id}/summary`
- Suppliers And Purchase Orders
  - `GET /api/v1/suppliers`
  - `POST /api/v1/suppliers`
  - `GET /api/v1/suppliers/{supplier_id}`
  - `PUT /api/v1/suppliers/{supplier_id}`
  - `DELETE /api/v1/suppliers/{supplier_id}`
  - `POST /api/v1/suppliers/{supplier_id}/products`
  - `PUT|PATCH /api/v1/suppliers/{supplier_id}/products/{product_id}`
  - `DELETE /api/v1/suppliers/{supplier_id}/products/{product_id}`
  - `GET /api/v1/purchase-orders`
  - `POST /api/v1/purchase-orders`
  - `GET /api/v1/purchase-orders/{po_id}`
  - `PUT|PATCH /api/v1/purchase-orders/{po_id}`
  - `POST|PUT /api/v1/purchase-orders/{po_id}/send`
  - `POST /api/v1/purchase-orders/{po_id}/confirm`
  - `GET /api/v1/purchase-orders/{po_id}/pdf`
  - `GET /api/v1/purchase-orders/{po_id}/pdf/download`
  - `POST /api/v1/purchase-orders/{po_id}/email`
- Transactions And Analytics
  - `GET /api/v1/transactions`
  - `POST /api/v1/transactions`
  - `POST /api/v1/transactions/batch`
  - `GET /api/v1/transactions/{id}`
  - `POST /api/v1/transactions/{id}/return`
  - `GET /api/v1/transactions/summary/daily`
  - `GET /api/v1/analytics/dashboard`
- Store
  - `GET /api/v1/store/profile`
  - `GET /api/v1/store/categories`
  - `GET /api/v1/store/tax-config`
- Forecasting
  - `GET /api/v1/forecasting/store`
  - `GET /api/v1/forecasting/sku/{product_id}`
  - `GET /api/v1/forecasting/demand-sensing/{product_id}`
- Developer
  - No `/api/v1/developer` root route exists.
  - Android must target explicit subroutes such as:
    - `POST /api/v1/developer/register`
    - `GET|POST /api/v1/developer/apps`
    - `PATCH|PUT|DELETE /api/v1/developer/apps/{app_ref}`
    - `POST /api/v1/developer/apps/{app_ref}/regenerate-secret`
    - `GET|POST /api/v1/developer/webhooks`
    - `PATCH|PUT|DELETE /api/v1/developer/webhooks/{app_ref}`
    - `POST /api/v1/developer/webhooks/{app_ref}/test`
    - `GET /api/v1/developer/usage`
    - `GET /api/v1/developer/rate-limits`
    - `GET /api/v1/developer/logs`
    - `GET /api/v1/developer/marketplace`
- Receipts And Vision
  - `GET|PUT /api/v1/receipts/template`
  - `POST /api/v1/receipts/print`
  - `GET /api/v1/receipts/print/{job_id}`
  - `POST /api/v1/vision/ocr/upload`
  - `GET /api/v1/vision/ocr/{job_id}`
  - `POST /api/v1/vision/ocr/{job_id}/confirm`
  - `POST /api/v1/vision/ocr/{job_id}/dismiss`
  - `POST /api/v1/vision/shelf-scan`
  - `POST /api/v1/vision/receipt`

## Explicit Alias And Oddity Notes

- Inventory exposes both:
  - `/api/v1/inventory/{product_id}/stock-update`
  - `/api/v1/inventory/{product_id}/stock`
- Inventory exposes both:
  - `/api/v1/inventory/stock-audit`
  - `/api/v1/inventory/audit`
- KYC paths intentionally duplicate the segment:
  - `/api/v1/kyc/kyc/providers`
  - `/api/v1/kyc/kyc/verify`
  - `/api/v1/kyc/kyc/status`
- I18N paths intentionally duplicate the segment:
  - `/api/v1/i18n/i18n/translations`
  - `/api/v1/i18n/i18n/currencies`
  - `/api/v1/i18n/i18n/countries`
- Decisions uses the blueprint root:
  - `GET /api/v1/decisions/`
- Market intelligence lives under `/api/v1/market`, not `/api/v1/marketplace`.

## Android Coverage Snapshot

Android currently has live transport and/or mobile surfaces for:

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
- staff
- system
- offline

Backend families not exposed as standalone Android module names but deliberately covered:

- auth
  - Represented by Android `authPanels()` and the live sign-in / refresh transport.
- team
  - Represented by Android `system` via `/api/v1/team/ping`.
- purchase-orders
  - Represented operationally inside the Android suppliers surface and documentation because the backend PO routes are a supplier-adjacent workflow.

AI v2 response-shape note:

- `POST /api/v2/ai/nlp/query` returns raw JSON, not `ApiEnvelope`.
- `POST /api/v2/ai/recommend` returns raw JSON, not `ApiEnvelope`.
- Android transport keeps those routes raw instead of forcing them through the envelope parser.
