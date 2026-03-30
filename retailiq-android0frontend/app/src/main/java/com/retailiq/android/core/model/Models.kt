package com.retailiq.android.core.model

import com.squareup.moshi.Json

data class ApiError(
    val code: String,
    val message: String,
)

data class ApiEnvelope<T>(
    val success: Boolean,
    val data: T?,
    val error: ApiError?,
    val meta: Map<String, Any?>? = null,
)

fun <T> ApiEnvelope<T>.unwrapOrThrow(): T {
    if (!success || data == null) {
        throw IllegalStateException(error?.message ?: "RetailIQ API request failed")
    }

    return data
}

data class Session(
    val accessToken: String,
    val refreshToken: String,
    val userId: Long,
    val storeId: Long?,
    val role: String?,
)

data class AuthRequest(
    @Json(name = "mobile_number") val mobileNumber: String,
    val password: String,
)

data class AuthResponse(
    @Json(name = "access_token") val accessToken: String,
    @Json(name = "refresh_token") val refreshToken: String,
    @Json(name = "user_id") val userId: Long,
    @Json(name = "store_id") val storeId: Long?,
    val role: String?,
)

data class AuthRefreshResponse(
    @Json(name = "access_token") val accessToken: String,
    @Json(name = "refresh_token") val refreshToken: String,
)

data class AuthRefreshRequest(
    @Json(name = "refresh_token") val refreshToken: String,
)

enum class AuthMode(val label: String) {
    SignIn("Sign In"),
    Register("Register"),
    VerifyOtp("Verify OTP"),
    ResetPassword("Reset"),
}

data class AuthPanel(
    val mode: AuthMode,
    val title: String,
    val description: String,
    val primaryAction: String,
    val helperText: String,
)

data class DashboardKpi(
    val label: String,
    val value: String,
    val trend: String,
)

data class DashboardInsight(
    val title: String,
    val body: String,
    val severity: String,
)

data class QuickAction(
    val title: String,
    val description: String,
)

data class DashboardSnapshot(
    val greeting: String,
    val storeName: String,
    val kpis: List<DashboardKpi>,
    val alerts: List<DashboardInsight>,
    val quickActions: List<QuickAction>,
    val timeline: List<String>,
)

data class ProductSummary(
    val id: Long,
    val name: String,
    val sku: String,
    val stock: Int,
    val reorderLevel: Int,
    val priceLabel: String,
    val supplier: String,
)

data class SalesDraftLine(
    val productName: String,
    val quantity: Int,
    val priceLabel: String,
)

data class SalesDraft(
    val orderId: String,
    val paymentMode: String,
    val totalLabel: String,
    val lines: List<SalesDraftLine>,
)

data class AnalyticsSummary(
    val headline: String,
    val cards: List<DashboardKpi>,
    val highlights: List<String>,
    val watchouts: List<String>,
)

data class AssistantPrompt(
    val title: String,
    val question: String,
)

enum class ModuleStatus {
    Ready,
    Planned,
}

enum class ModuleCategory(val label: String) {
    Commerce("Commerce"),
    Finance("Finance"),
    Growth("Growth"),
    Compliance("Compliance"),
    Operations("Operations"),
    Platform("Platform"),
}

data class ModuleRecord(
    val title: String,
    val supportingText: String,
    val value: String,
)

data class ModuleAction(
    val title: String,
    val detail: String,
)

data class ModuleSpec(
    val route: String,
    val title: String,
    val subtitle: String,
    val backendPrefix: String,
    val status: ModuleStatus,
    val category: ModuleCategory,
    val heroMetric: String,
    val description: String,
    val records: List<ModuleRecord>,
    val actions: List<ModuleAction>,
)

object RetailIqModuleCatalog {
    fun authPanels(): List<AuthPanel> = listOf(
        AuthPanel(
            mode = AuthMode.SignIn,
            title = "Store entry",
            description = "Mobile and password login for owners and staff with token refresh support.",
            primaryAction = "Enter Store Ops",
            helperText = "Maps to /api/v1/auth/login and /api/v1/auth/refresh.",
        ),
        AuthPanel(
            mode = AuthMode.Register,
            title = "New store onboarding",
            description = "Owner signup with store details and OTP dispatch.",
            primaryAction = "Create Account",
            helperText = "Maps to /api/v1/auth/register.",
        ),
        AuthPanel(
            mode = AuthMode.VerifyOtp,
            title = "OTP verification",
            description = "Account activation and verification checkpoint for registration or sensitive flows.",
            primaryAction = "Verify OTP",
            helperText = "Maps to /api/v1/auth/verify-otp.",
        ),
        AuthPanel(
            mode = AuthMode.ResetPassword,
            title = "Password recovery",
            description = "Lost-access flow for store operators without leaving the mobile app.",
            primaryAction = "Send Reset",
            helperText = "Maps to /api/v1/auth/forgot-password and /api/v1/auth/reset-password.",
        ),
    )

    fun defaultModules(): List<ModuleSpec> = listOf(
        ModuleSpec(
            route = "dashboard",
            title = "Dashboard",
            subtitle = "Executive overview and live risk.",
            backendPrefix = "/api/v1/dashboard/overview",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "Live dashboard",
            description = "Track overview, alerts, signals, forecasts, and incidents from the backend dashboard family.",
            records = listOf(
                ModuleRecord("Overview", "Sales, margin, and inventory summary", "Live"),
                ModuleRecord("Alerts", "Active operational alerts", "Live"),
                ModuleRecord("Incidents", "Backend incident feed", "Live"),
            ),
            actions = listOf(
                ModuleAction("Open overview", "Review the latest executive snapshot."),
                ModuleAction("Inspect alerts", "Drill into backend alert feed and incidents."),
            ),
        ),
        ModuleSpec(
            route = "inventory",
            title = "Inventory",
            subtitle = "Stock visibility and reorder cues.",
            backendPrefix = "/api/v1/inventory",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "Live inventory",
            description = "Operate the inventory family directly from the backend route tree instead of seeded local data.",
            records = listOf(
                ModuleRecord("Products", "Backend product list", "Live"),
                ModuleRecord("Stock audit", "Audit and adjustment routes", "Live"),
                ModuleRecord("Alerts", "Low-stock and price-history feeds", "Live"),
            ),
            actions = listOf(
                ModuleAction("Open stock list", "Browse backend inventory records."),
                ModuleAction("Run audit", "Review stock discrepancies and alerts."),
            ),
        ),
        ModuleSpec(
            route = "transactions",
            title = "Transactions",
            subtitle = "POS draft and recent transaction history.",
            backendPrefix = "/api/v1/transactions/summary/daily",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Commerce,
            heroMetric = "Live POS",
            description = "Link the counter flow to the backend transactions family instead of leaving it as a local draft.",
            records = listOf(
                ModuleRecord("Daily draft", "Current POS draft snapshot", "Live"),
                ModuleRecord("Recent transactions", "Backend transaction feed", "Live"),
                ModuleRecord("Returns", "Transaction return route", "Live"),
            ),
            actions = listOf(
                ModuleAction("Open daily draft", "Review the latest sale draft from the backend."),
                ModuleAction("Review history", "Inspect recent transaction activity."),
            ),
        ),
        ModuleSpec(
            route = "analytics",
            title = "Analytics",
            subtitle = "Revenue and profit analytics.",
            backendPrefix = "/api/v1/analytics/dashboard",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "Live analytics",
            description = "Expose the backend analytics dashboard as a dedicated mobile surface.",
            records = listOf(
                ModuleRecord("Revenue", "Analytics dashboard feed", "Live"),
                ModuleRecord("Profit", "Profitability view", "Live"),
                ModuleRecord("Highlights", "Top products and category breakdowns", "Live"),
            ),
            actions = listOf(
                ModuleAction("Open dashboard", "Review revenue, profit, and breakdowns."),
                ModuleAction("Check watchouts", "Inspect the live analytics risks."),
            ),
        ),
        ModuleSpec(
            route = "barcodes",
            title = "Barcodes",
            subtitle = "Barcode lookup and product tag registry.",
            backendPrefix = "/api/v1/barcodes",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "Scan-ready",
            description = "Resolve barcode values and inspect registered tags for products from the live backend barcode family.",
            records = listOf(
                ModuleRecord("Lookup", "Resolve a scanned value to a product", "Live"),
                ModuleRecord("Registry", "List barcodes for a selected product", "Live"),
                ModuleRecord("Register", "Attach a new barcode to a product", "Live"),
            ),
            actions = listOf(
                ModuleAction("Lookup barcode", "Resolve a code to product details."),
                ModuleAction("Open registry", "Inspect current barcodes for a product."),
            ),
        ),
        ModuleSpec(
            route = "store",
            title = "Store Admin",
            subtitle = "Profile, category, and tax controls.",
            backendPrefix = "/api/v1/store",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "1 active store profile",
            description = "Manage the store profile, categories, and GST mappings from one mobile-admin surface.",
            records = listOf(
                ModuleRecord("Store profile", "Business identity and contact details", "Healthy"),
                ModuleRecord("Category map", "Store categories and product coverage", "4"),
                ModuleRecord("Tax config", "GST rates aligned to the catalog", "Synced"),
            ),
            actions = listOf(
                ModuleAction("Open profile", "Review store type, address, and contact information."),
                ModuleAction("Bulk tax update", "Adjust category GST rates in one pass."),
            ),
        ),
        ModuleSpec(
            route = "customers",
            title = "Customers",
            subtitle = "Profiles, retention, and direct relationship actions.",
            backendPrefix = "/api/v1/customers",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Growth,
            heroMetric = "2,148 active profiles",
            description = "Track customer value, recent purchases, and engagement actions from one operator surface.",
            records = listOf(
                ModuleRecord("Repeat customers", "Customers with 2+ visits in 30 days", "684"),
                ModuleRecord("Dormant cohort", "Needs a reactivation message", "129"),
                ModuleRecord("High-value buyers", "Eligible for concierge outreach", "44"),
            ),
            actions = listOf(
                ModuleAction("Open customer detail", "Jump into lifetime value, notes, and purchase history."),
                ModuleAction("Launch campaign", "Send a recovery or reward campaign through WhatsApp."),
            ),
        ),
        ModuleSpec(
            route = "suppliers",
            title = "Suppliers",
            subtitle = "Vendor records, sourcing, and purchase order context.",
            backendPrefix = "/api/v1/suppliers",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "18 active vendors",
            description = "Compare vendor responsiveness, open orders, and risk concentration before raising a PO.",
            records = listOf(
                ModuleRecord("Late deliveries", "Vendor shipments delayed this week", "3"),
                ModuleRecord("Open POs", "Awaiting fulfillment", "6"),
                ModuleRecord("Single-source risk", "Critical SKUs with one supplier", "11"),
            ),
            actions = listOf(
                ModuleAction("Create purchase order", "Start a replenishment request with vendor context."),
                ModuleAction("Review vendor health", "Inspect lead times, service issues, and spend share."),
            ),
        ),
        ModuleSpec(
            route = "forecasting",
            title = "Forecasting",
            subtitle = "Demand planning and inventory recommendation surfaces.",
            backendPrefix = "/api/v1/forecasting",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "87% confidence on next 7 days",
            description = "Align replenishment with modeled demand shifts, local events, and category momentum.",
            records = listOf(
                ModuleRecord("High-risk SKUs", "Stockout probability above threshold", "14"),
                ModuleRecord("Overstock watch", "Capital tied up in slow movers", "9"),
                ModuleRecord("Recommended buys", "Suggested restock actions today", "22"),
            ),
            actions = listOf(
                ModuleAction("Review forecast drivers", "Inspect why projected demand changed."),
                ModuleAction("Send to inventory", "Convert recommendations into purchase actions."),
            ),
        ),
        ModuleSpec(
            route = "gst",
            title = "GST",
            subtitle = "Indian tax setup, summaries, and filing guidance.",
            backendPrefix = "/api/v1/gst",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Compliance,
            heroMetric = "12 mapped categories",
            description = "Keep category tax mapping, store tax configuration, and compliance checks in one place.",
            records = listOf(
                ModuleRecord("Mapped categories", "Categories with assigned GST rates", "12"),
                ModuleRecord("Missing HSN codes", "Products needing tax cleanup", "7"),
                ModuleRecord("Return readiness", "Current filing confidence", "On track"),
            ),
            actions = listOf(
                ModuleAction("Review tax config", "Update store-level tax mappings and defaults."),
                ModuleAction("Inspect product gaps", "Find items missing HSN or rate metadata."),
            ),
        ),
        ModuleSpec(
            route = "loyalty",
            title = "Loyalty",
            subtitle = "Points, tiers, and customer retention actions.",
            backendPrefix = "/api/v1/loyalty",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Growth,
            heroMetric = "42 redemptions today",
            description = "Manage earning rules, redemptions, and top customers without bouncing between tools.",
            records = listOf(
                ModuleRecord("Active members", "Members who earned or redeemed this month", "611"),
                ModuleRecord("Pending expiries", "Points that need a save campaign", "93"),
                ModuleRecord("Tier upgrades", "Customers close to next tier", "28"),
            ),
            actions = listOf(
                ModuleAction("Adjust points", "Owner-only manual corrections and goodwill credits."),
                ModuleAction("Run save campaign", "Message members with expiring balances."),
            ),
        ),
        ModuleSpec(
            route = "credit",
            title = "Credit",
            subtitle = "Ledgers, customer credit, and finance flows.",
            backendPrefix = "/api/v2/finance",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Finance,
            heroMetric = "Rs 68,400 outstanding",
            description = "Review customer balances, aging risk, and repayment nudges from the counter or office.",
            records = listOf(
                ModuleRecord("Aged balances", "Over 30 days overdue", "Rs 18,200"),
                ModuleRecord("On-time payers", "Healthy repeat credit users", "59"),
                ModuleRecord("New approvals", "Pending credit reviews", "5"),
            ),
            actions = listOf(
                ModuleAction("Open aging view", "Sort balances by risk and delinquency."),
                ModuleAction("Issue reminder", "Nudge a customer from within the app."),
            ),
        ),
        ModuleSpec(
            route = "kyc",
            title = "KYC",
            subtitle = "Verification workflows and provider status.",
            backendPrefix = "/api/v1/kyc",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Compliance,
            heroMetric = "3 pending verifications",
            description = "Collect store and finance verification data with a mobile-friendly operational flow.",
            records = listOf(
                ModuleRecord("Completed checks", "KYC records confirmed", "9"),
                ModuleRecord("Pending docs", "Awaiting uploads or verification", "3"),
                ModuleRecord("Provider health", "Connected verification integrations", "Healthy"),
            ),
            actions = listOf(
                ModuleAction("Resume submission", "Pick up incomplete verification tasks."),
                ModuleAction("Review provider status", "Confirm integration and service health."),
            ),
        ),
        ModuleSpec(
            route = "i18n",
            title = "I18N",
            subtitle = "Translations, currencies, and country defaults.",
            backendPrefix = "/api/v1/i18n",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "Locale-aware",
            description = "Expose translation catalogs and localization defaults from the backend i18n family.",
            records = listOf(
                ModuleRecord("Translations", "Locale catalog payload", "Live"),
                ModuleRecord("Currencies", "Active currency definitions", "Live"),
                ModuleRecord("Countries", "Country defaults and formats", "Live"),
            ),
            actions = listOf(
                ModuleAction("Review catalog", "Inspect current translation payloads."),
                ModuleAction("Open locale defaults", "Review currency and country support."),
            ),
        ),
        ModuleSpec(
            route = "market",
            title = "Market Intelligence",
            subtitle = "Competitors, signals, alerts, and recommendations.",
            backendPrefix = "/api/v1/market",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Commerce,
            heroMetric = "Live market feed",
            description = "Track competitor pricing, market alerts, and forecast signals directly from the backend market family.",
            records = listOf(
                ModuleRecord("Summary", "Market summary snapshot", "Live"),
                ModuleRecord("Signals", "Recent market signals", "Live"),
                ModuleRecord("Alerts", "Market pressure alerts", "Live"),
            ),
            actions = listOf(
                ModuleAction("Review competitors", "Compare competitor pricing and strategy."),
                ModuleAction("Open recommendations", "Inspect market-driven actions."),
            ),
        ),
        ModuleSpec(
            route = "receipts",
            title = "Receipts",
            subtitle = "Template, queue, and print operations.",
            backendPrefix = "/api/v1/receipts",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "98.7% print success",
            description = "Manage template text, pending print jobs, and delivery fallback from the handheld workflow.",
            records = listOf(
                ModuleRecord("Queued jobs", "Print jobs waiting on device", "4"),
                ModuleRecord("Template version", "Current receipt template revision", "v7"),
                ModuleRecord("Failed jobs", "Needs reprint or fallback send", "1"),
            ),
            actions = listOf(
                ModuleAction("Edit template", "Adjust paper width, footer, and tax visibility."),
                ModuleAction("Retry failed job", "Requeue print or switch to digital delivery."),
            ),
        ),
        ModuleSpec(
            route = "vision",
            title = "Vision",
            subtitle = "OCR review and scan-driven product workflows.",
            backendPrefix = "/api/v1/vision",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "92% OCR match rate",
            description = "Use the phone camera for barcode capture, shelf audits, and receipt extraction.",
            records = listOf(
                ModuleRecord("Pending review", "OCR jobs requiring operator confirmation", "8"),
                ModuleRecord("Shelf gaps", "Detected out-of-stock facings", "5"),
                ModuleRecord("Receipt imports", "Today's completed document captures", "17"),
            ),
            actions = listOf(
                ModuleAction("Open camera workflow", "Launch barcode, shelf, or receipt mode."),
                ModuleAction("Review OCR items", "Approve extracted items before applying them."),
            ),
        ),
        ModuleSpec(
            route = "ops",
            title = "Operations",
            subtitle = "Maintenance windows and incident watch.",
            backendPrefix = "/api/v1/ops",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "Healthy",
            description = "Monitor backend maintenance windows, ongoing incidents, and the latest system status check.",
            records = listOf(
                ModuleRecord("Maintenance windows", "Scheduled backend maintenance entries", "0"),
                ModuleRecord("Ongoing incidents", "Active incident records", "0"),
                ModuleRecord("Checked at", "Latest backend maintenance check", "Live"),
            ),
            actions = listOf(
                ModuleAction("Review maintenance", "Inspect planned downtime and service notes."),
                ModuleAction("Open incidents", "Check whether any active incident needs attention."),
            ),
        ),
        ModuleSpec(
            route = "tax",
            title = "Tax Engine",
            subtitle = "Tax config and filing summary across countries.",
            backendPrefix = "/api/v1/tax",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Compliance,
            heroMetric = "Tax-ready",
            description = "Mirror the multi-country tax engine backend family from a mobile-friendly operational module.",
            records = listOf(
                ModuleRecord("Config", "Country tax registration config", "Live"),
                ModuleRecord("Filing summary", "Taxable totals and filing status", "Live"),
                ModuleRecord("Calculation", "Preview tax calculation endpoint", "Available"),
            ),
            actions = listOf(
                ModuleAction("Open config", "Review store tax registration settings."),
                ModuleAction("Inspect filing summary", "Check current period tax totals."),
            ),
        ),
        ModuleSpec(
            route = "whatsapp",
            title = "WhatsApp",
            subtitle = "Campaigns, templates, and operational messaging.",
            backendPrefix = "/api/v1/whatsapp",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Growth,
            heroMetric = "3 active campaigns",
            description = "Run retention, reorder, or payment reminder messaging from within RetailIQ operations.",
            records = listOf(
                ModuleRecord("Opted-in contacts", "Reachable WhatsApp audience", "1,204"),
                ModuleRecord("Templates", "Approved message templates", "9"),
                ModuleRecord("Response rate", "Last 7 days campaign engagement", "18.4%"),
            ),
            actions = listOf(
                ModuleAction("Send campaign", "Trigger a targeted customer segment message."),
                ModuleAction("Test template", "Preview copy and delivery before launch."),
            ),
        ),
        ModuleSpec(
            route = "finance",
            title = "Finance",
            subtitle = "Treasury, balances, accounts, and lending state.",
            backendPrefix = "/api/v2/finance",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Finance,
            heroMetric = "Treasury live",
            description = "Expose the finance v2 family, including treasury, accounts, loans, and dashboard views.",
            records = listOf(
                ModuleRecord("Treasury", "Balance and sweep config", "Live"),
                ModuleRecord("Accounts", "Financial account inventory", "Live"),
                ModuleRecord("Loans", "Merchant lending records", "Live"),
            ),
            actions = listOf(
                ModuleAction("Open treasury", "Review reserve balance and sweep settings."),
                ModuleAction("Inspect accounts", "Check ledger and loan state."),
            ),
        ),
        ModuleSpec(
            route = "ai",
            title = "AI V2",
            subtitle = "Forecast, recommendations, and optimization entry points.",
            backendPrefix = "/api/v2/ai",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "Agent-ready",
            description = "Represent the AI v2 backend family and its forecast, recommendation, vision, and pricing endpoints.",
            records = listOf(
                ModuleRecord("Forecast", "AI forecast endpoint", "Available"),
                ModuleRecord("Recommend", "AI recommendation endpoint", "Available"),
                ModuleRecord("Pricing optimize", "AI pricing optimization endpoint", "Available"),
            ),
            actions = listOf(
                ModuleAction("Run recommendation", "Request AI recommendations for the current store."),
                ModuleAction("Open AI vision", "Use vision and pricing AI routes."),
            ),
        ),
        ModuleSpec(
            route = "events",
            title = "Events",
            subtitle = "Promotions, holidays, and local demand events.",
            backendPrefix = "/api/v1/events",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Growth,
            heroMetric = "6 upcoming demand events",
            description = "Tie local promotions and calendar events to inventory and staffing decisions.",
            records = listOf(
                ModuleRecord("Upcoming events", "Next 14 days", "6"),
                ModuleRecord("High-impact promos", "Events with large basket effect", "2"),
                ModuleRecord("Needs stock prep", "Events affecting replenishment", "4"),
            ),
            actions = listOf(
                ModuleAction("Review event calendar", "Inspect date windows and expected impact."),
                ModuleAction("Push into forecast", "Use event data to refine procurement."),
            ),
        ),
        ModuleSpec(
            route = "marketplace",
            title = "Marketplace",
            subtitle = "Omnichannel listings and catalog sync.",
            backendPrefix = "/api/v1/marketplace",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Commerce,
            heroMetric = "2 channels connected",
            description = "Monitor product sync health and order spillover across external marketplaces.",
            records = listOf(
                ModuleRecord("Listing mismatches", "Catalog inconsistencies to fix", "12"),
                ModuleRecord("Sync jobs", "Background sync queue health", "Stable"),
                ModuleRecord("External orders", "Orders imported this week", "83"),
            ),
            actions = listOf(
                ModuleAction("Inspect sync status", "Find which channels need intervention."),
                ModuleAction("Review imported orders", "Confirm downstream fulfillment."),
            ),
        ),
        ModuleSpec(
            route = "chain",
            title = "Chain",
            subtitle = "Multi-store coordination and headquarters visibility.",
            backendPrefix = "/api/v1/chain",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "4 stores in view",
            description = "Surface cross-store operations and benchmark metrics in a mobile-friendly chain view.",
            records = listOf(
                ModuleRecord("Store comparisons", "Stores under current group", "4"),
                ModuleRecord("Shared alerts", "Network-level operational risks", "3"),
                ModuleRecord("Transfer candidates", "Inventory balancing opportunities", "7"),
            ),
            actions = listOf(
                ModuleAction("Compare stores", "Benchmark key performance indicators."),
                ModuleAction("Review transfer ideas", "Shift stock before buying more."),
            ),
        ),
        ModuleSpec(
            route = "pricing",
            title = "Pricing",
            subtitle = "Pricing policy and elasticity tooling.",
            backendPrefix = "/api/v1/pricing",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Commerce,
            heroMetric = "11 suggested price moves",
            description = "Turn pricing recommendations into operator-reviewed decisions instead of blind automation.",
            records = listOf(
                ModuleRecord("Margin opportunities", "Products with safe increase headroom", "11"),
                ModuleRecord("Promo candidates", "Items needing discount support", "7"),
                ModuleRecord("Competitor gaps", "Potential mismatch alerts", "5"),
            ),
            actions = listOf(
                ModuleAction("Approve price change", "Push reviewed pricing to products."),
                ModuleAction("Open competitor view", "Compare external pricing signals."),
            ),
        ),
        ModuleSpec(
            route = "decisions",
            title = "Decisions",
            subtitle = "Rules and recommendation acceptance flows.",
            backendPrefix = "/api/v1/decisions",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "26 pending recommendations",
            description = "Review AI and rules-engine suggestions with enough context to accept or reject quickly.",
            records = listOf(
                ModuleRecord("Awaiting review", "Decisions not yet accepted", "26"),
                ModuleRecord("Accepted today", "Operator-approved changes", "9"),
                ModuleRecord("Rejected today", "Manually blocked changes", "4"),
            ),
            actions = listOf(
                ModuleAction("Review queue", "Triage pending recommendations."),
                ModuleAction("Audit accepted actions", "Track what changed and why."),
            ),
        ),
        ModuleSpec(
            route = "einvoicing",
            title = "E-Invoicing",
            subtitle = "Invoice generation and compliance workflows.",
            backendPrefix = "/api/v2/einvoice",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Compliance,
            heroMetric = "14 invoices generated",
            description = "Bring invoice generation and compliance acknowledgements into the operator app.",
            records = listOf(
                ModuleRecord("Generated today", "Invoices issued from current store", "14"),
                ModuleRecord("Rejected payloads", "Needs operator correction", "1"),
                ModuleRecord("Pending pushes", "Queued transmission jobs", "2"),
            ),
            actions = listOf(
                ModuleAction("Review failed invoice", "See validation or transmission errors."),
                ModuleAction("Retry queue", "Resend pending records."),
            ),
        ),
        ModuleSpec(
            route = "staff",
            title = "Staff Performance",
            subtitle = "Staff scorecards, leaderboards, and coaching.",
            backendPrefix = "/api/v1/staff",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Operations,
            heroMetric = "8 active staff members",
            description = "Give managers shift-level visibility into sales, service, and attendance trends.",
            records = listOf(
                ModuleRecord("Top performer", "Best revenue contribution this week", "Asha"),
                ModuleRecord("Needs coaching", "Low conversion or low basket size", "2"),
                ModuleRecord("Attendance risk", "Repeated late check-ins", "1"),
            ),
            actions = listOf(
                ModuleAction("Open leaderboard", "Compare team performance."),
                ModuleAction("Review coaching list", "Spot people who need intervention."),
            ),
        ),
        ModuleSpec(
            route = "developer",
            title = "Developer",
            subtitle = "Webhooks, keys, and integration management.",
            backendPrefix = "/api/v1/developer/apps",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "5 integrations active",
            description = "Give technical operators a mobile window into webhooks, credentials, and delivery status.",
            records = listOf(
                ModuleRecord("Webhook endpoints", "Registered callback destinations", "5"),
                ModuleRecord("Recent failures", "Integrations needing attention", "0"),
                ModuleRecord("API consumers", "Known internal and partner clients", "3"),
            ),
            actions = listOf(
                ModuleAction("Review webhooks", "Check delivery failures and retry posture."),
                ModuleAction("Open integration docs", "Quick mobile reference for technical operators."),
            ),
        ),
        ModuleSpec(
            route = "system",
            title = "System Status",
            subtitle = "Health checks and team ping.",
            backendPrefix = "/health",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "Backend healthy",
            description = "Surface the backend health and team ping status directly in the mobile shell for quick diagnostics.",
            records = listOf(
                ModuleRecord("API", "Primary app endpoints", "ok"),
                ModuleRecord("Backend version", "Reported by /health", "Live"),
                ModuleRecord("Team ping", "No-auth backend reachability check", "success"),
            ),
            actions = listOf(
                ModuleAction("Open health", "Confirm API health and backend version."),
                ModuleAction("Run team ping", "Verify the shell can reach the backend."),
            ),
        ),
        ModuleSpec(
            route = "offline",
            title = "Offline Sync",
            subtitle = "Queue health, replay, and local safety status.",
            backendPrefix = "/api/v1/offline",
            status = ModuleStatus.Ready,
            category = ModuleCategory.Platform,
            heroMetric = "Sync healthy",
            description = "Show queue state, retry health, and safe-to-operate guidance for unstable connectivity.",
            records = listOf(
                ModuleRecord("Queued mutations", "Actions waiting to sync", "3"),
                ModuleRecord("Last successful sync", "Time since healthy flush", "2 min ago"),
                ModuleRecord("Conflict warnings", "Requires manual operator review", "0"),
            ),
            actions = listOf(
                ModuleAction("Inspect queue", "See which actions are pending."),
                ModuleAction("Force replay", "Retry synchronization when online."),
            ),
        ),
    )

    fun module(route: String): ModuleSpec =
        defaultModules().firstOrNull { it.route == route } ?: defaultModules().first()
}

