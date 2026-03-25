# RetailIQ Unified Frontend Plan

## Objective

Build a new frontend in `retailiq-frontend` that:

- uses `RetailIQ-main` as the backend contract source of truth
- reuses `retailIQ-Frontend-codex-frontend-readiness` for proven API integration patterns only
- reproduces the UI and interaction language of `RETAILOS-main`
- implements all required backend-backed screens and workflows end-to-end
- respects real backend request/response contracts exactly, including legacy and irregular endpoints

## Repositories Analyzed

### 1. Backend: `RetailIQ-main`

What it is:

- Flask backend with broad API coverage
- 261 route decorators found under `app/`
- large contract test suite, including explicit frontend/backend parity tests and endpoint lifecycle tests

What I used as source of truth:

- blueprint registration in `RetailIQ-main/app/__init__.py`
- route implementations in `RetailIQ-main/app/**/routes.py`
- auth/inventory/store/customer schemas where needed
- contract tests in:
  - `RetailIQ-main/tests/test_frontend_backend_contracts.py`
  - `RetailIQ-main/tests/test_frontend_backend_parity.py`
- docs in `RetailIQ-main/API_GUIDE.md`, but only as secondary reference because it is partially outdated

### 2. API reference frontend: `retailIQ-Frontend-codex-frontend-readiness`

What it is:

- React + Vite frontend with many backend integrations already wired
- useful as the current best map of endpoint usage, fallback handling, normalization, and client-side models
- not visually reusable for the final product

What it contributes:

- route/page inventory for almost every backend module
- endpoint adapters for irregular backend behavior
- auth/token refresh/session logic
- existing request models, hooks, and endpoint-specific transformations

### 3. UI reference: `RETAILOS-main`

What it is:

- Next.js UI shell with strong visual direction
- mostly mock-data or internal Next API driven
- valuable for layout, navigation, visual hierarchy, motion, component language, and page composition
- not trustworthy for Flask backend contracts

What it contributes:

- sidebar/header/dashboard shell
- page visual structure for dashboard, inventory, orders, customers, analytics, financials, AI assistant, settings, reports, alerts
- design tokens, component language, motion, typography, spacing, and responsive behavior

## Important Constraints Discovered

### The backend docs are not fully current

Examples:

- `API_GUIDE.md` documents auth as mobile-first, but the real backend login flow also supports email OTP login and the current readiness frontend already depends on that.
- `API_GUIDE.md` documents `/api/v1/inventory/products`, but the actual backend route is `/api/v1/inventory` with aliases only for some sub-actions.
- `API_GUIDE.md` suggests mixed envelopes for store APIs, but actual store routes use `standard_json`.
- some actual response bodies differ from the examples in the guide.

Conclusion:

- do not generate frontend code from `API_GUIDE.md` alone
- generate endpoint clients from actual route implementations plus contract tests

### RetailOS UI is not backend-ready

Examples:

- `RETAILOS-main/app/dashboard/inventory/page.tsx` fetches `/api/inventory` from its own Next layer and also starts from mock inventory data
- `RETAILOS-main/app/dashboard/customers/page.tsx` is fully mock-data driven
- `RETAILOS-main/app/dashboard/analytics/page.tsx` is mock-data driven
- `RETAILOS-main/app/dashboard/financials/page.tsx` is mock-data driven
- `RETAILOS-main/app/dashboard/ai/page.tsx` talks to its own Next `/api/ai/chat`

Conclusion:

- copy UX patterns, not data plumbing
- every RetailOS screen needs a new contract-aware data layer

### The readiness frontend is useful, but not infallible

Examples:

- `src/config/backendCapabilities.ts` claims some market intelligence features are unavailable, but backend tests prove they exist
- several TypeScript models reflect earlier assumptions and normalize backend output after the fact
- its nav covers many backend modules that RetailOS UI does not have

Conclusion:

- reuse its transport, endpoint adapters, and fallback logic
- verify each endpoint against backend code/tests before porting

## Definitive Backend Surface

Registered blueprint prefixes from `RetailIQ-main/app/__init__.py`:

- `/api/v1/auth`
- `/api/v1/analytics`
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

Also present outside these:

- `/`
- `/health`
- `/ws`

## Contract Rules The New Frontend Must Respect

### 1. Response handling cannot assume one global shape

Observed categories:

- standard envelope endpoints using `success`, `data`, `error`, `meta`
- some endpoints returning `data` with `meta`
- some legacy/v2 endpoints returning raw objects or raw arrays
- some endpoints where the readiness frontend already uses custom normalizers or `requestAny`

Required implementation rule:

- central API client must support:
  - envelope unwrap
  - raw passthrough
  - endpoint-level parsers
  - fallback URLs where backend is duplicated or inconsistent

### 2. Auth is hybrid

Actual backend behavior:

- register requires:
  - `mobile_number`
  - `password`
  - `full_name`
  - `email`
  - optional `store_name`
  - optional `role`
- login accepts either:
  - `email` for OTP login flow
  - `mobile_number` + `password` for credential login flow
- verify OTP accepts `email` or `mobile_number` plus `otp`
- verify OTP returns tokens and user context
- refresh expects `refresh_token`
- logout optionally accepts `refresh_token`
- MFA endpoints exist and are active

Required implementation rule:

- auth UI must support the actual email OTP flow first
- also preserve mobile+password path if product wants full parity with backend capability
- session persistence and refresh flow can be adapted from readiness frontend

### 3. Role gating is partly backend-enforced and partly a frontend concern

Observed:

- many owner-only routes have explicit `@require_role("owner")`
- some routes documented as owner-only are not consistently protected in code
- examples:
  - product create/delete/audit are owner-protected
  - product update is authenticated but not owner-protected in the route implementation

Required implementation rule:

- frontend should still present owner/staff UX intentionally
- do not rely on frontend hiding alone for security
- note any backend inconsistencies as risks during implementation

### 4. The frontend must support irregular route aliases

Examples already handled in readiness frontend:

- inventory stock update:
  - `/api/v1/inventory/:id/stock`
  - `/api/v1/inventory/:id/stock-update`
- inventory audit:
  - `/api/v1/inventory/audit`
  - `/api/v1/inventory/stock-audit`
- KYC duplicated route forms:
  - `/api/v1/kyc/providers` vs `/api/v1/kyc/kyc/providers`
  - same issue for verify/status
- i18n routes include duplicated segment under the blueprint:
  - `/api/v1/i18n/i18n/translations`
  - `/api/v1/i18n/i18n/currencies`
  - `/api/v1/i18n/i18n/countries`

Required implementation rule:

- keep the readiness frontend’s fallback strategy for these modules

## High-Confidence Backend Contract Matrix

### Core commerce

#### Auth

- register: `POST /api/v1/auth/register`
- verify OTP: `POST /api/v1/auth/verify-otp`
- resend OTP: `POST /api/v1/auth/resend-otp`
- login: `POST /api/v1/auth/login`
- refresh: `POST /api/v1/auth/refresh`
- logout: `DELETE /api/v1/auth/logout`
- forgot password: `POST /api/v1/auth/forgot-password`
- reset password: `POST /api/v1/auth/reset-password`
- MFA setup: `POST /api/v1/auth/mfa/setup`
- MFA verify: `POST /api/v1/auth/mfa/verify`

#### Store

- profile: `GET/PUT /api/v1/store/profile`
- categories: `GET/POST /api/v1/store/categories`
- category update/delete: `PUT/DELETE /api/v1/store/categories/:category_id`
- tax config: `GET/PUT /api/v1/store/tax-config`

#### Inventory

- list/create: `GET/POST /api/v1/inventory`
- detail/update/delete: `GET/PUT/DELETE /api/v1/inventory/:product_id`
- stock update: `POST /api/v1/inventory/:product_id/stock`
- stock update alias: `POST /api/v1/inventory/:product_id/stock-update`
- stock audit: `POST /api/v1/inventory/audit`
- stock audit alias: `POST /api/v1/inventory/stock-audit`
- price history: `GET /api/v1/inventory/:product_id/price-history`
- alerts: `GET /api/v1/inventory/alerts`
- dismiss alert: `DELETE /api/v1/inventory/alerts/:alert_id`

#### Transactions / POS

- create: `POST /api/v1/transactions`
- batch sync: `POST /api/v1/transactions/batch`
- list: `GET /api/v1/transactions`
- detail: `GET /api/v1/transactions/:uuid`
- return: `POST /api/v1/transactions/:uuid/return`
- daily summary: `GET /api/v1/transactions/summary/daily`

#### Customers

- list/create: `GET/POST /api/v1/customers`
- detail/update: `GET/PUT /api/v1/customers/:customer_id`
- transaction history: `GET /api/v1/customers/:customer_id/transactions`
- summary: `GET /api/v1/customers/:customer_id/summary`
- top customers: `GET /api/v1/customers/top`
- analytics: `GET /api/v1/customers/analytics`

### Dashboard and analytics

#### Dashboard

- overview: `GET /api/v1/dashboard/overview`
- alerts: `GET /api/v1/dashboard/alerts`
- live signals: `GET /api/v1/dashboard/live-signals`
- store forecasts: `GET /api/v1/dashboard/forecasts/stores`
- incidents: `GET /api/v1/dashboard/incidents/active`
- alert feed: `GET /api/v1/dashboard/alerts/feed`

#### Analytics

- dashboard snapshot: `GET /api/v1/analytics/dashboard`
- revenue: `GET /api/v1/analytics/revenue`
- profit: `GET /api/v1/analytics/profit`
- top products: `GET /api/v1/analytics/top-products`
- category breakdown: `GET /api/v1/analytics/category-breakdown`
- contribution: `GET /api/v1/analytics/contribution`
- payment modes: `GET /api/v1/analytics/payment-modes`
- customer summary: `GET /api/v1/analytics/customers/summary`
- diagnostics: `GET /api/v1/analytics/diagnostics`

### Forecasting and decisions

- store forecast: `GET /api/v1/forecasting/store`
- SKU forecast: `GET /api/v1/forecasting/sku/:product_id`
- demand sensing: `GET /api/v1/forecasting/demand-sensing/:product_id`
- decisions: `GET /api/v1/decisions/`
- NLP query: `POST /api/v1/nlp`
- AI v2:
  - `POST /api/v2/ai/forecast`
  - `POST /api/v2/ai/vision/shelf-scan`
  - `POST /api/v2/ai/vision/receipt`
  - `POST /api/v2/ai/nlp/query`
  - `POST /api/v2/ai/recommend`
  - `POST /api/v2/ai/pricing/optimize`

### Supply chain / purchasing

- suppliers CRUD: `/api/v1/suppliers`
- supplier-product links: `/api/v1/suppliers/:supplier_id/products...`
- purchase orders list/create/detail/update:
  - `/api/v1/purchase-orders`
  - `/api/v1/purchase-orders/:po_id`
- PO actions:
  - `/send`
  - `/receive`
  - `/confirm`
  - `/cancel`
  - `/pdf`
  - `/pdf/download`
  - `/email`

### Additional business modules with real backend coverage

- loyalty
- credit
- pricing
- staff performance
- GST
- tax calculator
- events
- developer platform and webhooks
- marketplace
- market intelligence
- chain
- WhatsApp
- receipts and barcodes
- vision OCR and receipt digitization
- KYC
- e-invoicing
- finance treasury/ledger/loan/credit score/KYC
- offline snapshot
- i18n
- ops maintenance
- team ping

These are not optional if the goal is “all APIs 100% implemented”.

## Contract Mismatches And Risks To Call Out Explicitly

### Auth mismatches

- the readiness frontend login page is correctly built around email OTP
- the API guide still describes mobile/password as primary
- the new frontend must expose the real flow, not the outdated doc flow

### Store envelope mismatch

- docs mention a special `status/message/data` store envelope
- actual store routes use `standard_json`
- frontend should normalize store the same way as other v1 modules

### Inventory path mismatch

- docs mention `/inventory/products`
- actual routes are mounted directly at `/api/v1/inventory`
- do not introduce `/products` in the new client

### Inventory response mismatch

- stock update returns the serialized product in `data`
- stock audit returns `201` and `data.items`, not the older `adjustments` example

### Customer filter mismatch

- list customers uses `name` and `mobile` query params
- customer transaction history uses `date_from` and `date_to`
- avoid generic `search` assumptions here

### Forecasting response mismatch

- route implementation returns:
  - `data: { historical, forecast }`
  - metadata in `meta`
- route points use `predicted`, not the earlier guide’s `forecast_mean`

### Dashboard/analytics field-shape mismatch

- analytics dashboard contract in route code matches many of the stricter notes in the API guide
- payment mode and category breakdown shapes differ from some readiness-page assumptions and need adapter-level normalization

### Finance v2 raw responses

- several finance endpoints return raw objects/arrays rather than standard envelopes
- this is why the readiness frontend uses endpoint-specific adapters there
- the new frontend should reuse that adapter pattern rather than forcing a global schema

### KYC and i18n path weirdness

- duplicated path segments are real backend behavior right now
- do not “clean them up” in the frontend without first changing backend routes

## What The Existing Frontends Tell Us

## `retailIQ-Frontend-codex-frontend-readiness` findings

### Strengths to reuse

- axios client with token refresh and auth recovery
- endpoint wrappers for almost every backend module
- fallback requests where routes are inconsistent
- hooks/query organization already split by domain
- a nearly complete app route inventory

### Weaknesses to avoid copying directly

- visual system is disposable
- some types are historical approximations, not perfect contract definitions
- some pages are functional but not product-grade
- nav and IA are backend-centric rather than aligned to the RetailOS user experience

## `RETAILOS-main` findings

### UI patterns to reuse

- sidebar shell and sticky top header
- page spacing, card density, border treatment, hover behavior, motion
- command palette/action search
- dashboard information hierarchy
- polished inventory, orders, customers, analytics, financials, AI layouts
- responsive desktop/mobile nav split

### Data patterns not to reuse

- local mock datasets
- internal Next `/api/*` layer
- screen-level assumptions that do not match Flask routes
- modules that do not exist in the backend contract

## RetailOS Screen Inventory To Preserve Visually

- login
- register
- dashboard home
- inventory
- inventory sync
- orders
- customers list
- customer detail
- omnichannel
- financials
- financial calendar
- smart alerts
- AI assistant
- analytics
- reports
- settings

## Extra Backend-Driven Screens Required Beyond RetailOS

These exist in the backend and readiness frontend, but not in RetailOS as finished backend-backed pages:

- POS sale creation
- transaction list
- transaction detail
- store profile
- category management
- store tax config
- supplier management
- purchase order list/detail/create/edit/receive
- receipts template and print queue
- barcode lookup/register/list
- vision OCR upload/review
- KYC
- developer apps/webhooks/usage/logs/rate limits/marketplace
- marketplace procurement
- chain groups/transfers/dashboard/compare
- WhatsApp config/templates/messages/campaigns/message log/contact status
- i18n lookup pages
- GST config/summary/GSTR1/HSN mappings/liability slabs/tax calculator
- loyalty program/tiers/accounts/adjustments/analytics/expiring points
- credit account/repayment/history
- forecasting store/SKU/demand sensing
- pricing suggestions/history/rules
- AI decisions
- e-invoicing
- staff performance
- offline snapshot
- finance dashboard/accounts/ledger/loans/treasury/KYC/credit score

Conclusion:

- the final app cannot be only a RetailOS page clone
- it must be a RetailOS-styled product shell that expands to cover all backend modules

## Proposed Information Architecture For `retailiq-frontend`

### Primary nav styled like RetailOS

- Dashboard
- Inventory
- Orders
- Customers
- Analytics
- Financials
- AI Assistant
- Operations
- Settings

### Nested sections under those nav groups

#### Dashboard

- executive dashboard
- smart alerts
- inventory sync
- financial calendar
- reports

#### Inventory

- products
- stock audit
- receipts and barcodes
- vision OCR
- pricing
- forecasting

#### Orders

- POS
- transactions
- returns
- purchase orders
- suppliers
- omnichannel marketplace

#### Customers

- customer list/detail
- loyalty
- credit
- WhatsApp
- events

#### Analytics

- business analytics
- market intelligence
- decisions
- offline
- staff performance

#### Financials

- finance dashboard
- ledger/accounts
- treasury
- loans
- GST/tax
- e-invoicing

#### AI Assistant

- chat/NLP
- AI tools
- AI recommendations

#### Operations

- chain management
- KYC
- developer platform

#### Settings

- profile
- categories
- tax config
- i18n
- auth/security/MFA

## Recommended Technical Architecture For `retailiq-frontend`

### Framework

- React + TypeScript
- prefer Vite unless there is a strong requirement to stay on Next

Why:

- the readiness frontend already provides React + Vite + route + query + axios patterns
- easier to port its API layer directly
- user asked for a new unified frontend, not a migration of the RetailOS Next app

### Core libraries

- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- a component layer ported from RetailOS visual patterns

### Suggested folder structure

- `src/app`
- `src/routes`
- `src/layout`
- `src/features/auth`
- `src/features/dashboard`
- `src/features/inventory`
- `src/features/orders`
- `src/features/customers`
- `src/features/analytics`
- `src/features/finance`
- `src/features/ai`
- `src/features/settings`
- `src/features/shared`
- `src/api`
- `src/lib`
- `src/types`
- `src/components/ui`
- `src/components/retailos`

### Data layer strategy

- start from readiness frontend `src/api/*` and `src/hooks/*`
- keep endpoint adapters by domain
- move parsing close to each endpoint, not in one giant global decoder
- add contract tests or mock fixtures per domain using captured backend shapes

### UI strategy

- port RetailOS shell first:
  - sidebar
  - header
  - command palette
  - card styles
  - chart containers
  - tables
  - modals
  - responsive nav
- then rebuild each page on the real API layer

## Implementation Phases

### Phase 0. Build the canonical contract layer first

- copy and clean the readiness frontend API client
- keep refresh-token flow and auth store/session utilities
- create one domain module per backend prefix
- encode exact request/response types from route code, not from old docs
- preserve fallback logic for KYC, inventory aliases, and other irregular endpoints

Deliverable:

- a backend-accurate API SDK inside `retailiq-frontend/src/api`

### Phase 1. Port RetailOS shell and global design system

- recreate sidebar/header/layout in plain React
- port core visual primitives from RetailOS:
  - cards
  - buttons
  - badges
  - inputs
  - tables
  - tabs
  - dialogs
  - command palette
  - chart wrappers
- port global CSS tokens and motion language

Deliverable:

- RetailOS-looking app frame with empty route placeholders

### Phase 2. Replace highest-value RetailOS screens with real backend data

Priority order:

- auth
- dashboard
- inventory
- transactions/POS/orders
- customers
- analytics
- financials
- AI assistant

Reason:

- these are the main RetailOS surfaces users will judge first
- they also map closely to existing backend coverage

### Phase 3. Add the backend-only modules in RetailOS style

- suppliers/purchase orders
- receipts/barcodes/vision
- loyalty/credit
- GST/tax/e-invoicing
- market intelligence/chain/marketplace
- WhatsApp/developer/KYC/i18n/offline/staff performance/finance extras

Deliverable:

- full feature parity with backend and readiness frontend, but with a coherent RetailOS visual system

### Phase 4. Hardening and parity verification

- route-by-route manual QA
- compare every screen action against backend tests
- add frontend smoke tests for:
  - auth flow
  - CRUD list/detail/create/update/delete flows
  - file upload flows
  - PDF download flows
  - polling flows
  - raw-response finance endpoints
  - fallback route handling

## Screen-to-Backend Mapping Plan

### RetailOS Dashboard Home

Primary backend sources:

- `/api/v1/dashboard/overview`
- `/api/v1/dashboard/alerts`
- `/api/v1/dashboard/live-signals`
- `/api/v1/dashboard/incidents/active`
- `/api/v1/dashboard/alerts/feed`
- optional supporting analytics:
  - `/api/v1/analytics/dashboard`

Notes:

- keep the RetailOS hero/cards/activity structure
- replace mock order feed with real transactions or alerts feed

### RetailOS Inventory

Primary backend sources:

- `/api/v1/inventory`
- `/api/v1/inventory/alerts`
- `/api/v1/store/categories`
- `/api/v1/inventory/:id`
- `/api/v1/inventory/:id/stock`
- `/api/v1/inventory/audit`
- `/api/v1/inventory/:id/price-history`

Notes:

- RetailOS inventory already has good visual modules
- swap mock filters/grid/table modals for real product CRUD and stock operations

### RetailOS Orders

Recommended real mapping:

- POS sales:
  - `/api/v1/transactions`
- transaction list/detail/returns:
  - `/api/v1/transactions`
  - `/api/v1/transactions/:id`
  - `/api/v1/transactions/:id/return`
- procurement:
  - `/api/v1/purchase-orders`
  - `/api/v1/suppliers`

Important:

- “Orders” in RetailOS is broader than one backend entity
- the unified frontend should split tabs inside the page:
  - Sales
  - Returns
  - Purchase Orders

### RetailOS Customers

Primary backend sources:

- `/api/v1/customers`
- `/api/v1/customers/:id`
- `/api/v1/customers/:id/transactions`
- `/api/v1/customers/:id/summary`
- `/api/v1/customers/top`
- `/api/v1/customers/analytics`
- `/api/v1/loyalty/*`
- `/api/v1/credit/*`
- `/api/v1/whatsapp/*`

Notes:

- keep RetailOS segmentation/detail feel
- back it with real customer summary and analytics data
- add loyalty/credit/WhatsApp tabs to customer detail

### RetailOS Analytics

Primary backend sources:

- `/api/v1/analytics/dashboard`
- `/api/v1/analytics/revenue`
- `/api/v1/analytics/profit`
- `/api/v1/analytics/top-products`
- `/api/v1/analytics/category-breakdown`
- `/api/v1/analytics/payment-modes`
- `/api/v1/analytics/customers/summary`
- `/api/v1/analytics/contribution`
- `/api/v1/analytics/diagnostics`

Notes:

- reuse RetailOS chart-heavy layout
- replace all mock datasets

### RetailOS Financials

Primary backend sources:

- `/api/v2/finance/dashboard`
- `/api/v2/finance/accounts`
- `/api/v2/finance/ledger`
- `/api/v2/finance/treasury/balance`
- `/api/v2/finance/treasury/config`
- `/api/v2/finance/treasury/sweep-config`
- `/api/v2/finance/treasury/transactions`
- `/api/v2/finance/loans`
- `/api/v2/finance/loans/apply`
- `/api/v2/finance/loans/:id/disburse`
- `/api/v2/finance/credit-score`
- `/api/v2/finance/credit-score/refresh`
- `/api/v2/finance/kyc/submit`
- `/api/v2/finance/kyc/status`

Notes:

- this module needs special response normalization because v2 finance is less envelope-consistent

### RetailOS AI Assistant

Primary backend sources:

- `/api/v1/nlp`
- `/api/v1/decisions/`
- `/api/v2/ai/nlp/query`
- `/api/v2/ai/recommend`
- `/api/v2/ai/forecast`
- `/api/v2/ai/pricing/optimize`
- `/api/v2/ai/vision/shelf-scan`
- `/api/v2/ai/vision/receipt`

Notes:

- keep RetailOS full-screen chat UI
- add tool cards / tabs for structured AI actions

### RetailOS Settings / Reports / Alerts / Inventory Sync / Omnichannel / Calendar

Recommended mapping:

- Settings:
  - store profile
  - categories
  - tax config
  - i18n
  - auth/security/MFA
- Reports:
  - analytics exports
  - finance exports
  - GST/GSTR1
- Smart Alerts:
  - dashboard alerts
  - inventory alerts
  - market alerts
- Inventory Sync:
  - offline snapshot
  - transaction batch sync status
  - chain transfer visibility if needed
- Omnichannel:
  - marketplace
  - WhatsApp campaigns
  - online/market signals
- Financial Calendar:
  - events
  - GST filing milestones
  - forecast checkpoints

## Concrete Work Breakdown For Code Generation

### 1. Bootstrap `retailiq-frontend`

- create Vite React TS app
- install:
  - `react-router-dom`
  - `@tanstack/react-query`
  - `axios`
  - `react-hook-form`
  - `zod`
  - chart library compatible with RetailOS visuals
- copy lint/type/test setup from readiness frontend where useful

### 2. Port transport and session layer

- port `src/api/client.ts`
- port token storage and session persistence
- port auth store/query client setup
- keep refresh retry and redirect behavior

### 3. Generate backend SDK by domain

- auth
- store
- inventory
- transactions
- customers
- dashboard
- analytics
- suppliers
- purchase orders
- receipts/barcodes
- vision
- KYC
- developer
- marketplace
- chain
- WhatsApp
- i18n
- GST/tax
- loyalty/credit
- forecasting
- pricing
- decisions
- e-invoicing
- finance
- events
- market intelligence
- offline
- platform/ops/team

### 4. Port the RetailOS shell

- sidebar
- header
- toasts
- command palette
- global theme/tokens
- mobile bottom nav

### 5. Rebuild pages in this order

1. login/register/verify OTP/reset/MFA
2. dashboard
3. inventory + product detail/form + stock audit
4. POS + transactions + returns
5. customers + detail
6. analytics
7. financials
8. AI assistant
9. suppliers + purchase orders
10. receipts/barcodes/vision
11. loyalty + credit + WhatsApp
12. GST + tax + e-invoicing
13. forecasting + pricing + decisions
14. marketplace + market intelligence + chain
15. developer + KYC + i18n + offline + staff + ops

## Verification Checklist

### Backend-contract verification

For every endpoint used by the frontend:

- verify URL prefix
- verify HTTP method
- verify auth requirement
- verify owner/staff restriction
- verify request field names
- verify query param names
- verify response shape
- verify pagination shape
- verify file upload field names
- verify status codes for success and error cases

### Frontend QA verification

- auth token refresh works
- logout clears session
- OTP flows work for register and login
- CRUD tables paginate correctly
- filters use the real query param names
- owner-only screens/actions are hidden or disabled for staff
- file uploads use correct multipart field names:
  - OCR invoice
  - receipt image
- downloads work:
  - purchase order PDF
  - receipt print blob flows if added
- polling/review flows work:
  - OCR review
  - message logs
  - campaign send status if needed
- finance pages tolerate raw response shapes
- KYC and inventory fallback routes are covered

### Regression checks against existing backend tests

Use the parity/contract test suite as a manual checklist for:

- developer lifecycle
- market intelligence detail/alerts/forecasts/recommendations
- loyalty tier CRUD and bulk adjustments
- GST mapping and filing
- supplier + purchase order draft/send/confirm/pdf/email
- WhatsApp template/campaign/contact lifecycle
- chain group membership and transfers
- finance treasury defaults/history

## Risks

- backend docs and implementation diverge in several areas
- some backend modules are inconsistent in response envelopes
- RetailOS pages may tempt direct reuse, but many are mock-data-first
- some backend authorization rules are weaker or different than the docs imply
- i18n and KYC path quirks can easily break a naive generated client
- finance v2 endpoints need endpoint-specific parsers

## Recommended Generation Strategy

If generating code with an agent:

- generate the API layer first
- then generate RetailOS-styled shared layout/components
- then generate one feature slice at a time
- after each slice, verify against backend route code and contract tests before moving on
- do not generate pages directly from `API_GUIDE.md`
- do not port RetailOS fetch logic as-is
- do not trust frontend-readiness types unless checked against backend code

## Delivery Definition Of Done

The new `retailiq-frontend` is done only when:

- every required screen is present
- every screen uses the real RetailIQ backend
- every API call matches backend expectations exactly
- no RetailOS mock dataset remains in active flows
- auth/session refresh works
- owner/staff UX is coherent
- file upload/download flows are functional
- visual design matches RetailOS closely
- all major flows are verified against backend contract tests and route code

## Notes From This Analysis

- I did not execute the backend app locally because the environment is missing installed Python dependencies such as `flask_cors`, so route execution was validated by source inspection and existing tests rather than by booting the server.
- The safest starting point is to treat `RetailIQ-main/app/**/routes.py` plus the parity tests as canonical, and treat both existing frontends as helpers rather than authorities.
