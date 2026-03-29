package com.retailiq.android.core.data

import android.content.Context
import com.retailiq.android.BuildConfig
import com.retailiq.android.core.model.AnalyticsSummary
import com.retailiq.android.core.model.ApiEnvelope
import com.retailiq.android.core.model.AssistantPrompt
import com.retailiq.android.core.model.AssistantResponseSnapshot
import com.retailiq.android.core.model.AuthPanel
import com.retailiq.android.core.model.AuthRequest
import com.retailiq.android.core.model.AuthRefreshRequest
import com.retailiq.android.core.model.AuthRefreshResponse
import com.retailiq.android.core.model.CustomerAnalyticsDto
import com.retailiq.android.core.model.CustomerCenterSnapshot
import com.retailiq.android.core.model.CustomerDirectorySnapshot
import com.retailiq.android.core.model.CustomerListItemDto
import com.retailiq.android.core.model.CustomerProfileSnapshot
import com.retailiq.android.core.model.CustomerRankSnapshot
import com.retailiq.android.core.model.CustomerSummaryDto
import com.retailiq.android.core.model.DeveloperApplicationSnapshot
import com.retailiq.android.core.model.DeveloperConsoleSnapshot
import com.retailiq.android.core.model.DeveloperLogEntry
import com.retailiq.android.core.model.DeveloperMarketplaceSnapshot
import com.retailiq.android.core.model.DeveloperRateLimitSnapshot
import com.retailiq.android.core.model.DeveloperUsageMetric
import com.retailiq.android.core.model.DeveloperAppDto
import com.retailiq.android.core.model.DeveloperLogsDto
import com.retailiq.android.core.model.DeveloperMarketplaceDto
import com.retailiq.android.core.model.DeveloperRateLimitDto
import com.retailiq.android.core.model.DeveloperUsageStatsDto
import com.retailiq.android.core.model.DeveloperWebhookDto
import com.retailiq.android.core.model.DashboardInsight
import com.retailiq.android.core.model.DashboardKpi
import com.retailiq.android.core.model.DashboardAlertsDto
import com.retailiq.android.core.model.DashboardForecastsDto
import com.retailiq.android.core.model.DashboardIncidentsDto
import com.retailiq.android.core.model.DashboardInventoryProductDto
import com.retailiq.android.core.model.DashboardOverviewDto
import com.retailiq.android.core.model.DashboardSignalsDto
import com.retailiq.android.core.model.DashboardSnapshot
import com.retailiq.android.core.model.ForecastingSnapshot
import com.retailiq.android.core.model.ForecastHistoricalPoint
import com.retailiq.android.core.model.ForecastHistoricalPointDto
import com.retailiq.android.core.model.ForecastPoint
import com.retailiq.android.core.model.ForecastPointDto
import com.retailiq.android.core.model.ForecastReorderSuggestionDto
import com.retailiq.android.core.model.ForecastSuggestion
import com.retailiq.android.core.model.DemandSensingDto
import com.retailiq.android.core.model.HealthSignal
import com.retailiq.android.core.model.ModuleSpec
import com.retailiq.android.core.model.ModuleAction
import com.retailiq.android.core.model.ModuleCategory
import com.retailiq.android.core.model.ModuleRecord
import com.retailiq.android.core.model.ModuleStatus
import com.retailiq.android.core.model.ProductSummary
import com.retailiq.android.core.model.QuickAction
import com.retailiq.android.core.model.RetailIqModuleCatalog
import com.retailiq.android.core.model.ReceiptsSnapshot
import com.retailiq.android.core.model.PrintJobSummary
import com.retailiq.android.core.model.ReceiptTemplateSnapshot
import com.retailiq.android.core.model.ReceiptTemplateDto
import com.retailiq.android.core.model.PrintJobDto
import com.retailiq.android.core.model.SalesDraft
import com.retailiq.android.core.model.SalesDraftLine
import com.retailiq.android.core.model.Session
import com.retailiq.android.core.model.StoreAdminSnapshot
import com.retailiq.android.core.model.StoreCategorySnapshot
import com.retailiq.android.core.model.StoreProfileSnapshot
import com.retailiq.android.core.model.StoreTaxConfigSnapshot
import com.retailiq.android.core.model.SupplierCenterSnapshot
import com.retailiq.android.core.model.SupplierProfileSnapshot
import com.retailiq.android.core.model.SupplierAnalyticsDto
import com.retailiq.android.core.model.SupplierDetailDto
import com.retailiq.android.core.model.SupplierListItemDto
import com.retailiq.android.core.model.SystemStatusSnapshot
import com.retailiq.android.core.model.StoreCategoryDto
import com.retailiq.android.core.model.StoreProfileDto
import com.retailiq.android.core.model.StoreTaxConfigDto
import com.retailiq.android.core.model.SystemHealthDto
import com.retailiq.android.core.model.TeamPingDto
import com.retailiq.android.core.model.NlpQueryDto
import com.retailiq.android.core.model.NlpRecommendationsDto
import com.retailiq.android.core.model.TopCustomerDto
import com.retailiq.android.core.model.VisionActionResponseDto
import com.retailiq.android.core.model.VisionOcrJobDto
import com.retailiq.android.core.model.VisionOcrUploadResponseDto
import com.retailiq.android.core.model.VisionReceiptDto
import com.retailiq.android.core.model.VisionShelfScanDto
import com.retailiq.android.core.model.unwrapOrThrow
import com.retailiq.android.core.network.AuthHeaderInterceptor
import com.retailiq.android.core.network.AiV2Api
import com.retailiq.android.core.network.AnalyticsApi
import com.retailiq.android.core.network.AuthApi
import com.retailiq.android.core.network.CustomersApi
import com.retailiq.android.core.network.DashboardApi
import com.retailiq.android.core.network.DeveloperApi
import com.retailiq.android.core.network.NlpApi
import com.retailiq.android.core.network.ForecastingApi
import com.retailiq.android.core.network.InventoryApi
import com.retailiq.android.core.network.OperationsApi
import com.retailiq.android.core.network.LongTailApi
import com.retailiq.android.core.network.ReceiptsApi
import com.retailiq.android.core.network.SuppliersApi
import com.retailiq.android.core.network.VisionApi
import com.retailiq.android.core.network.StoreApi
import com.retailiq.android.core.network.SystemApi
import com.retailiq.android.core.network.TransactionsApi
import com.retailiq.android.core.session.EncryptedPreferencesSessionStore
import com.retailiq.android.core.session.InMemorySessionStore
import com.retailiq.android.core.session.SessionStore
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

class RetailIqRepository private constructor(
    private val sessionStore: SessionStore,
    private val authApi: AuthApi?,
    private val dashboardApi: DashboardApi?,
    private val storeApi: StoreApi?,
    private val inventoryApi: InventoryApi?,
    private val customersApi: CustomersApi?,
    private val suppliersApi: SuppliersApi?,
    private val forecastingApi: ForecastingApi?,
    private val receiptsApi: ReceiptsApi?,
    private val developerApi: DeveloperApi?,
    private val nlpApi: NlpApi?,
    private val visionApi: VisionApi?,
    private val aiV2Api: AiV2Api?,
    private val transactionsApi: TransactionsApi?,
    private val analyticsApi: AnalyticsApi?,
    private val operationsApi: OperationsApi?,
    private val systemApi: SystemApi?,
    private val longTailApi: LongTailApi?,
) {
    suspend fun authPanels(): List<AuthPanel> = RetailIqModuleCatalog.authPanels()

    fun currentSession(): Session? = sessionStore.current()

    suspend fun signIn(mobileNumber: String, password: String): Session {
        if (authApi == null) {
            return persistSession(
                Session(
                    accessToken = "local-access",
                    refreshToken = "local-refresh",
                    userId = 1L,
                    storeId = 101L,
                    role = "owner",
                ),
            )
        }

        return authApi
            .login(AuthRequest(mobileNumber = mobileNumber, password = password))
            .unwrapOrThrow()
            .let { response ->
                persistSession(
                    Session(
                        accessToken = response.accessToken,
                        refreshToken = response.refreshToken,
                        userId = response.userId,
                        storeId = response.storeId,
                        role = response.role,
                    ),
                )
            }
    }

    suspend fun refreshSession(): Session? {
        val current = sessionStore.current() ?: return null
        val api = authApi ?: return current

        return runCatching {
            api.refresh(AuthRefreshRequest(refreshToken = current.refreshToken)).unwrapOrThrow()
        }.map { response: AuthRefreshResponse ->
            Session(
                accessToken = response.accessToken,
                refreshToken = response.refreshToken,
                userId = current.userId,
                storeId = current.storeId,
                role = current.role,
            )
        }.onSuccess { refreshed ->
            sessionStore.save(refreshed)
        }.getOrElse {
            sessionStore.clear()
            null
        }
    }

    fun signOut() {
        sessionStore.clear()
    }

    private fun persistSession(session: Session): Session {
        sessionStore.save(session)
        return session
    }

    private fun humanizeKey(key: String): String {
        return key
            .replace('_', ' ')
            .replace(Regex("([a-z0-9])([A-Z])"), "$1 $2")
            .trim()
            .replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    }

    private fun stringifyValue(value: Any?): String {
        return when (value) {
            null -> "Not set"
            is String -> value
            is Number, is Boolean -> value.toString()
            is Map<*, *> -> value.entries
                .take(3)
                .joinToString(", ") { "${humanizeKey(it.key.toString())}=${stringifyValue(it.value)}" }
            is Iterable<*> -> value
                .take(3)
                .joinToString(", ") { stringifyValue(it) }
            else -> value.toString()
        }
    }

    private fun asInt(value: Any?): Int? = when (value) {
        is Number -> value.toInt()
        is String -> value.toIntOrNull()
        else -> null
    }

    private fun stringValue(map: Map<String, Any?>, key: String, fallback: String = "Not set"): String {
        return map[key]?.let { stringifyValue(it) } ?: fallback
    }

    private fun asStringMapList(value: Any?): List<Map<String, Any?>> {
        return when (value) {
            is List<*> -> value.filterIsInstance<Map<String, Any?>>()
            else -> emptyList()
        }
    }

    private fun asStringMap(value: Any?): Map<String, Any?> {
        return when (value) {
            is Map<*, *> -> value.entries.associate { entry -> entry.key.toString() to entry.value }
            else -> emptyMap()
        }
    }

    private fun recordsFromMap(
        map: Map<String, Any?>,
        excludeKeys: Set<String> = emptySet(),
        limit: Int = 4,
    ): List<ModuleRecord> {
        return map.entries
            .filterNot { excludeKeys.contains(it.key) }
            .take(limit)
            .map { entry ->
                ModuleRecord(
                    title = humanizeKey(entry.key),
                    supportingText = "Live backend",
                    value = stringifyValue(entry.value),
                )
            }
    }

    private fun recordsFromList(
        label: String,
        items: List<Map<String, Any?>>,
        valueKey: String? = null,
        limit: Int = 3,
    ): List<ModuleRecord> {
        return items.take(limit).mapIndexed { index, item ->
            ModuleRecord(
                title = "$label ${index + 1}",
                supportingText = "Live backend",
                value = valueKey?.let { stringifyValue(item[it]) } ?: stringifyValue(item),
            )
        }
    }

    private fun moduleSpec(
        route: String,
        title: String,
        subtitle: String,
        backendPrefix: String,
        heroMetric: String,
        description: String,
        records: List<ModuleRecord>,
        actions: List<ModuleAction>,
        category: ModuleCategory,
    ): ModuleSpec {
        return ModuleSpec(
            route = route,
            title = title,
            subtitle = subtitle,
            backendPrefix = backendPrefix,
            status = ModuleStatus.Ready,
            category = category,
            heroMetric = heroMetric,
            description = description,
            records = records,
            actions = actions,
        )
    }

    private fun currentPeriod(): String {
        return java.time.YearMonth.now().toString()
    }

    suspend fun dashboard(): DashboardSnapshot {
        val api = dashboardApi
        if (api != null) {
            val overview = loadRemote(
                remote = { api.overview() },
                fallback = DashboardOverviewDto(
                    sales = 184000.0,
                    salesDelta = "+12.6%",
                    salesSparkline = com.retailiq.android.core.model.DashboardSparklineDto(metric = "sales", points = emptyList()),
                    grossMargin = 24.8,
                    grossMarginDelta = "+1.4%",
                    grossMarginSparkline = com.retailiq.android.core.model.DashboardSparklineDto(metric = "gross_margin", points = emptyList()),
                    inventoryAtRisk = 14,
                    inventoryAtRiskDelta = "-3",
                    inventoryAtRiskSparkline = com.retailiq.android.core.model.DashboardSparklineDto(metric = "inventory_at_risk", points = emptyList()),
                    outstandingPos = 6,
                    outstandingPosDelta = "+2",
                    outstandingPosSparkline = com.retailiq.android.core.model.DashboardSparklineDto(metric = "outstanding_pos", points = emptyList()),
                    loyaltyRedemptions = 42,
                    loyaltyRedemptionsDelta = "+8.5%",
                    loyaltyRedemptionsSparkline = com.retailiq.android.core.model.DashboardSparklineDto(metric = "loyalty_redemptions", points = emptyList()),
                    onlineOrders = 18,
                    onlineOrdersDelta = "+6%",
                    onlineOrdersSparkline = com.retailiq.android.core.model.DashboardSparklineDto(metric = "online_orders", points = emptyList()),
                    lastUpdated = "2026-03-29T00:00:00Z",
                ),
            )
            val alerts = loadRemote(
                remote = { api.alerts(limit = 5) },
                fallback = DashboardAlertsDto(alerts = emptyList(), hasMore = false, nextCursor = null),
            )
            val signals = loadRemote(
                remote = { api.liveSignals() },
                fallback = DashboardSignalsDto(signals = emptyList(), lastUpdated = overview.lastUpdated),
            )
            val forecasts = loadRemote(
                remote = { api.storeForecasts() },
                fallback = DashboardForecastsDto(forecasts = emptyList()),
            )
            val incidents = loadRemote(
                remote = { api.activeIncidents() },
                fallback = DashboardIncidentsDto(incidents = emptyList()),
            )

            return DashboardSnapshot(
                greeting = "Live dashboard synced from backend signals and alerts.",
                storeName = forecasts.forecasts.firstOrNull()?.storeName ?: "RetailIQ Live Store",
                kpis = listOf(
                    DashboardKpi("Sales", "Rs ${overview.sales.toInt()}", overview.salesDelta),
                    DashboardKpi("Gross margin", "${overview.grossMargin}%", overview.grossMarginDelta),
                    DashboardKpi("Inventory at risk", overview.inventoryAtRisk.toString(), overview.inventoryAtRiskDelta),
                    DashboardKpi("Pending POs", overview.outstandingPos.toString(), overview.outstandingPosDelta),
                ),
                alerts = buildList {
                    alerts.alerts.take(3).forEach { alert ->
                        add(DashboardInsight(alert.title, alert.message, alert.severity.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }))
                    }
                    incidents.incidents.take(2).forEach { incident ->
                        add(DashboardInsight(incident.title, incident.description, incident.severity.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }))
                    }
                    signals.signals.take(2).forEach { signal ->
                        add(DashboardInsight(signal.productName, signal.recommendation, signal.region.ifBlank { "Signal" }))
                    }
                },
                quickActions = buildList {
                    signals.signals.take(2).forEach { signal ->
                        add(QuickAction("Review ${signal.productName}", signal.insight))
                    }
                    alerts.alerts.take(1).forEach { alert ->
                        add(QuickAction("Act on ${alert.type}", alert.message))
                    }
                    forecasts.forecasts.firstOrNull()?.let { forecast ->
                        add(QuickAction("Open forecast", "Forecast loaded for ${forecast.storeName} with ${forecast.forecast.size} points."))
                    }
                },
                timeline = buildList {
                    add("Last updated ${overview.lastUpdated.replace('T', ' ').replace("Z", "")}.")
                    alerts.alerts.take(2).forEach { alert ->
                        add("${alert.timestamp.replace('T', ' ').replace("Z", "")} • ${alert.title}")
                    }
                    incidents.incidents.take(1).forEach { incident ->
                        add("${incident.createdAt.replace('T', ' ').replace("Z", "")} • ${incident.title}")
                    }
                },
            )
        }

        val local = DashboardSnapshot(
            greeting = "Store floor is stable and ready for action",
            storeName = "RetailIQ Flagship",
            kpis = listOf(
                DashboardKpi("Sales", "Rs 1.84L", "+12.6%"),
                DashboardKpi("Low Stock", "14 SKUs", "-3.1%"),
                DashboardKpi("Pending POs", "6", "+2"),
                DashboardKpi("Loyalty Redemptions", "42", "+8.5%"),
            ),
            alerts = listOf(
                DashboardInsight("Cold drinks stock risk", "Demand is spiking near evening hours. Replenish before 5 PM.", "High"),
                DashboardInsight("Margin drift", "Discounting on snacks is widening beyond the last 7 day baseline.", "Medium"),
                DashboardInsight("Festival signal", "Local traffic indicators suggest a weekend basket-size lift.", "Info"),
            ),
            quickActions = listOf(
                QuickAction("Create PO", "Restock the SKUs the forecast flagged."),
                QuickAction("Launch recovery campaign", "Re-engage dormant customers from the last 30 days."),
                QuickAction("Review OCR jobs", "Clear receipt and shelf tasks before the evening shift."),
            ),
            timeline = listOf(
                "09:00 AM • Sales opened stronger than yesterday.",
                "11:30 AM • Two supplier deliveries still pending confirmation.",
                "01:15 PM • GST mapping clean except for seven products missing HSN codes.",
                "04:45 PM • Beverage category demand turning above forecast baseline.",
            ),
        )

        return local
    }

    suspend fun inventory(): List<ProductSummary> {
        val api = inventoryApi
        if (api != null) {
            val liveProducts = runCatching {
                api.products(page = 1, pageSize = 24, lowStock = false, slowMoving = false).unwrapOrThrow()
            }.getOrElse {
                listOf(
                    DashboardInventoryProductDto(1001, "Basmati Rice 5kg", "RICE-5KG", null, 18.0, 12.0, 420.0, "Agri Source", "pcs", true),
                    DashboardInventoryProductDto(1002, "Cold Brew Bottle", "BEV-CB-01", null, 9.0, 15.0, 145.0, "Urban Beverages", "pcs", true),
                    DashboardInventoryProductDto(1003, "Detergent Pack", "HOME-DG-3", null, 27.0, 10.0, 210.0, "Bright Clean", "pcs", true),
                    DashboardInventoryProductDto(1004, "Protein Snack Bar", "SNK-PRO-7", null, 6.0, 8.0, 65.0, "Fit Foods", "pcs", true),
                    DashboardInventoryProductDto(1005, "Masala Noodles Box", "SNK-MSL-3", null, 34.0, 20.0, 30.0, "Quick Foods", "pcs", true),
                    DashboardInventoryProductDto(1006, "Kids Fruit Drink", "BEV-KID-4", null, 11.0, 18.0, 25.0, "Urban Beverages", "pcs", true),
                )
            }

            return liveProducts.map { product ->
                ProductSummary(
                    id = product.productId,
                    name = product.name,
                    sku = product.skuCode,
                    stock = product.currentStock.toInt(),
                    reorderLevel = product.reorderLevel.toInt(),
                    priceLabel = "Rs ${product.sellingPrice.toInt()}",
                    supplier = product.supplierName ?: "Unknown supplier",
                )
            }
        }

        val local = listOf(
            ProductSummary(1001, "Basmati Rice 5kg", "RICE-5KG", 18, 12, "Rs 420", "Agri Source"),
            ProductSummary(1002, "Cold Brew Bottle", "BEV-CB-01", 9, 15, "Rs 145", "Urban Beverages"),
            ProductSummary(1003, "Detergent Pack", "HOME-DG-3", 27, 10, "Rs 210", "Bright Clean"),
            ProductSummary(1004, "Protein Snack Bar", "SNK-PRO-7", 6, 8, "Rs 65", "Fit Foods"),
            ProductSummary(1005, "Masala Noodles Box", "SNK-MSL-3", 34, 20, "Rs 30", "Quick Foods"),
            ProductSummary(1006, "Kids Fruit Drink", "BEV-KID-4", 11, 18, "Rs 25", "Urban Beverages"),
        )

        return local
    }

    suspend fun salesDraft(): SalesDraft {
        val local = SalesDraft(
            orderId = "#POS-20041",
            paymentMode = "UPI",
            totalLabel = "Rs 2,480",
            lines = listOf(
                SalesDraftLine("Cold Brew Bottle", 4, "Rs 145"),
                SalesDraftLine("Protein Snack Bar", 10, "Rs 65"),
                SalesDraftLine("Detergent Pack", 6, "Rs 210"),
            ),
        )

        return loadRemote(remote = { transactionsApi?.draft() }, fallback = local)
    }

    suspend fun analytics(): AnalyticsSummary {
        val local = AnalyticsSummary(
            headline = "Beverages are driving growth while household essentials still protect margin.",
            cards = listOf(
                DashboardKpi("Revenue", "Rs 8.6L", "+9.4%"),
                DashboardKpi("Profit", "Rs 1.7L", "+6.1%"),
                DashboardKpi("Orders", "2,841", "+11.3%"),
                DashboardKpi("AOV", "Rs 302", "-1.8%"),
            ),
            highlights = listOf(
                "Beverages are contributing the largest growth delta this week.",
                "Household essentials remain the strongest margin bucket.",
                "Cash share is dropping while UPI volume continues to rise.",
            ),
            watchouts = listOf(
                "Snack discounting is outpacing its margin protection band.",
                "Three categories are tracking below forecast despite active promotions.",
                "One vendor concentration issue is pushing inventory risk on staples.",
            ),
        )

        return loadRemote(remote = { analyticsApi?.summary() }, fallback = local)
    }

    suspend fun storeSnapshot(): StoreAdminSnapshot {
        val fallbackProfile = StoreProfileDto(
            storeId = 1L,
            storeName = "RetailIQ Flagship",
            storeType = "grocery",
            address = "123 Main St, Pune",
            phone = "Unavailable",
            gstNumber = "22AAAAA0000A1Z5",
            currency = "INR",
        )
        val fallbackCategories = listOf(
            StoreCategoryDto(1L, "Beverages", 12.0),
            StoreCategoryDto(2L, "Dairy", 5.0),
            StoreCategoryDto(3L, "Snacks", 18.0),
            StoreCategoryDto(4L, "Household", 12.0),
        )

        val profileDto = loadRemote(remote = { storeApi?.profile() }, fallback = fallbackProfile)
        val categoriesDto = loadRemote(remote = { storeApi?.categories() }, fallback = fallbackCategories)
        val taxConfigDto = loadRemote(
            remote = { storeApi?.taxConfig() },
            fallback = StoreTaxConfigDto(taxes = fallbackCategories),
        )

        return StoreAdminSnapshot(
            profile = profileDto.toSnapshot(businessHours = "09:00 AM - 10:00 PM"),
            categories = categoriesDto.map { it.toSnapshot() },
            taxConfig = StoreTaxConfigSnapshot(
                taxes = taxConfigDto.taxes.map { it.toSnapshot() },
            ),
            notes = listOf(
                "Changing the store type for the first time should seed default categories.",
                "Tax rates are aligned to the category map used by inventory and receipts.",
            ),
        )
    }

    suspend fun customerSnapshot(): CustomerCenterSnapshot {
        val fallbackCustomers = listOf(
            CustomerListItemDto(101L, 1L, "Asha Sharma", "9876500011", "asha@example.com", null, null, "Pune", null, "2026-03-28T09:00:00Z"),
            CustomerListItemDto(102L, 1L, "Rahul Verma", "9876500012", "rahul@example.com", null, null, "Pune", null, "2026-03-29T08:15:00Z"),
            CustomerListItemDto(103L, 1L, "Priya Singh", "9876500013", "priya@example.com", null, null, "Pune", null, "2026-03-24T14:45:00Z"),
        )
        val fallbackAnalytics = CustomerAnalyticsDto(
            newCustomers = 12,
            uniqueCustomersMonth = 148,
            newRevenue = 48000.0,
            repeatCustomers = 136,
            repeatRevenue = 124000.0,
            repeatRatePct = 91.9,
            avgLifetimeValue = 1575.0,
        )
        val fallbackTop = listOf(
            TopCustomerDto(101L, "Asha Sharma", "9876500011", 42, 180000.0),
            TopCustomerDto(102L, "Rahul Verma", "9876500012", 21, 92000.0),
            TopCustomerDto(103L, "Priya Singh", "9876500013", 8, 31000.0),
        )
        val fallbackSummary = CustomerSummaryDto(
            visitCount = 21,
            lastVisitDate = "2026-03-29T08:15:00Z",
            totalLifetimeSpend = 92000.0,
            avgBasketSize = 3511.0,
            isRepeatCustomer = true,
        )

        val liveCustomers = loadRemote(remote = { customersApi?.listCustomers(page = 1, pageSize = 8) }, fallback = fallbackCustomers)
        val liveAnalytics = loadRemote(remote = { customersApi?.analytics() }, fallback = fallbackAnalytics)
        val liveTop = loadRemote(remote = { customersApi?.topCustomers(metric = "revenue", limit = 3) }, fallback = fallbackTop)

        val summary = liveTop.firstOrNull()?.let { firstCustomer ->
            loadRemote(remote = { customersApi?.summary(firstCustomer.customerId) }, fallback = fallbackSummary)
        } ?: fallbackSummary

        return CustomerCenterSnapshot(
            headline = "Monthly active customers: ${liveAnalytics.uniqueCustomersMonth}. Repeat share is ${liveAnalytics.repeatRatePct}%.",
            metrics = listOf(
                DashboardKpi("Active", liveAnalytics.uniqueCustomersMonth.toString(), "+${liveAnalytics.repeatRatePct}%"),
                DashboardKpi("New", liveAnalytics.newCustomers.toString(), "This month"),
                DashboardKpi("Repeat", liveAnalytics.repeatCustomers.toString(), "Returning"),
                DashboardKpi("Avg basket", "Rs ${summary.avgBasketSize.toInt()}", "From summary"),
            ),
            topCustomers = liveTop.mapIndexed { index, customer ->
                CustomerRankSnapshot(
                    customerId = customer.customerId,
                    name = customer.name,
                    mobileNumber = customer.mobileNumber,
                    valueLabel = "Rs ${customer.totalRevenue.toInt()}",
                    note = "${customer.visitCount} visits - rank ${index + 1}",
                )
            },
            directory = liveCustomers.map { customer ->
                CustomerDirectorySnapshot(
                    customerId = customer.customerId,
                    name = customer.name,
                    mobileNumber = customer.mobileNumber,
                    email = customer.email,
                    createdAt = customer.createdAt,
                )
            },
            insights = listOf(
                "New revenue this month is Rs ${liveAnalytics.newRevenue.toInt()}.",
                "Repeat revenue is Rs ${liveAnalytics.repeatRevenue.toInt()} and should keep the save campaign warm.",
                "Selected customer summary shows ${summary.visitCount} visits and Rs ${summary.totalLifetimeSpend.toInt()} lifetime spend.",
            ),
            actions = listOf(
                "Launch retention campaign",
                "Open customer detail",
            ),
        )
    }

    suspend fun supplierSnapshot(): SupplierCenterSnapshot {
        val fallbackSuppliers = listOf(
            SupplierListItemDto("201", "Agri Source", "Manoj Jain", "agri@example.com", "9890000011", 30, 3.0, 96.5, 1.2),
            SupplierListItemDto("202", "Urban Beverages", "Leena Rao", "beverages@example.com", "9890000012", 21, 5.0, 88.2, 2.4),
            SupplierListItemDto("203", "Bright Clean", "Nikhil Mehta", "clean@example.com", "9890000013", 15, 2.0, 99.1, 0.6),
        )

        val liveSuppliers = loadRemote(remote = { suppliersApi?.suppliers() }, fallback = fallbackSuppliers)
        val supplierDetails = liveSuppliers.take(3).map { supplier ->
            loadRemote(
                remote = { suppliersApi?.supplier(supplier.id) },
                fallback = SupplierDetailDto(
                    id = supplier.id,
                    name = supplier.name,
                    contact = com.retailiq.android.core.model.SupplierContactDto(
                        name = supplier.contactName,
                        phone = supplier.phone,
                        email = supplier.email,
                        address = null,
                    ),
                    paymentTermsDays = supplier.paymentTermsDays,
                    isActive = true,
                    analytics = SupplierAnalyticsDto(
                        avgLeadTimeDays = supplier.avgLeadTimeDays,
                        fillRate90d = supplier.fillRate90d,
                    ),
                    sourcedProducts = emptyList(),
                    recentPurchaseOrders = emptyList(),
                ),
            )
        }

        val highestRisk = supplierDetails
            .sortedBy { it.analytics?.fillRate90d ?: 100.0 }
            .firstOrNull()

        return SupplierCenterSnapshot(
            headline = "Supplier coverage is live. ${liveSuppliers.size} vendors are active and ${supplierDetails.count { (it.analytics?.fillRate90d ?: 0.0) < 90.0 }} need attention.",
            suppliers = supplierDetails.map { supplier ->
                val fillRate = supplier.analytics?.fillRate90d ?: 0.0
                val leadTime = supplier.analytics?.avgLeadTimeDays ?: 0.0
                val categoryFocus = supplier.sourcedProducts.firstOrNull()?.name ?: "General"
                SupplierProfileSnapshot(
                    supplierId = supplier.id.toLongOrNull() ?: 0L,
                    name = supplier.name,
                    contact = supplier.contact.name ?: "Unknown",
                    phone = supplier.contact.phone ?: "",
                    reliability = if (fillRate >= 95.0) "Reliable" else if (fillRate >= 85.0) "Watch" else "Risk",
                    openPurchaseOrders = supplier.recentPurchaseOrders.size,
                    leadTimeDays = leadTime.toInt(),
                    categoryFocus = categoryFocus,
                )
            },
            riskNotes = buildList {
                highestRisk?.let { add("${it.name} has the weakest fill rate and should be checked first.") }
                if (supplierDetails.any { (it.analytics?.avgLeadTimeDays ?: 0.0) > 4.0 }) {
                    add("At least one supplier is above the preferred lead-time threshold.")
                }
            }.ifEmpty { listOf("Supplier performance is within threshold for the current store.") },
            actions = listOf(
                "Create purchase order",
                "Review vendor health",
            ),
        )
    }

    suspend fun forecastingSnapshot(): ForecastingSnapshot {
        val fallbackStoreForecast = ApiEnvelope(
            success = true,
            data = listOf(
                ForecastPointDto("2026-03-30", 14500.0, 12000.0, 17000.0),
                ForecastPointDto("2026-03-31", 15150.0, 12600.0, 17800.0),
                ForecastPointDto("2026-04-01", 14800.0, 12300.0, 17250.0),
                ForecastPointDto("2026-04-02", 15620.0, 13100.0, 18100.0),
            ),
            error = null,
            meta = mapOf(
                "regime" to "stable",
                "model_type" to "prophet",
                "confidence_tier" to "prophet",
                "training_window_days" to 90,
                "generated_at" to "2026-03-29T00:00:00",
                "reorder_suggestion" to mapOf(
                    "should_reorder" to true,
                    "current_stock" to 15.0,
                    "forecasted_demand" to 87.5,
                    "lead_time_days" to 3,
                    "lead_time_demand" to 37.5,
                    "suggested_order_qty" to 42.5,
                ),
            ),
        )
        val liveInventory = runCatching {
            inventoryApi?.products()?.unwrapOrThrow()?.map { product ->
                ProductSummary(
                    id = product.productId,
                    name = product.name,
                    sku = product.skuCode,
                    stock = product.currentStock.toInt(),
                    reorderLevel = product.reorderLevel.toInt(),
                    priceLabel = "Rs ${product.sellingPrice.toInt()}",
                    supplier = product.supplierName ?: "Unknown supplier",
                )
            }.orEmpty()
        }.getOrElse {
            listOf(ProductSummary(1001, "Cold Brew Bottle", "BEV-CB-01", 15, 12, "Rs 145", "Urban Beverages"))
        }
        val selectedProduct = liveInventory.firstOrNull()
        val storeResponse = try {
            forecastingApi?.storeForecast(7)
        } catch (_: Exception) {
            null
        } ?: fallbackStoreForecast
        val skuResponse = selectedProduct?.let { product ->
            try {
                forecastingApi?.skuForecast(product.id, 7)
            } catch (_: Exception) {
                null
            } ?: ApiEnvelope(
                success = true,
                data = listOf(
                    ForecastPointDto("2026-03-30", 12.5, 8.0, 17.0),
                    ForecastPointDto("2026-03-31", 13.0, 8.4, 17.8),
                    ForecastPointDto("2026-04-01", 13.7, 9.1, 18.4),
                    ForecastPointDto("2026-04-02", 14.3, 9.7, 19.1),
                ),
                error = null,
                meta = mapOf(
                    "product_id" to product.id,
                    "product_name" to product.name,
                    "regime" to "stable",
                    "model_type" to "prophet",
                    "confidence_tier" to "prophet",
                    "training_window_days" to 90,
                    "generated_at" to "2026-03-29T00:00:00",
                    "reorder_suggestion" to mapOf(
                        "should_reorder" to true,
                        "current_stock" to product.stock.toDouble(),
                        "forecasted_demand" to 87.5,
                        "lead_time_days" to 3,
                        "lead_time_demand" to 37.5,
                        "suggested_order_qty" to 42.5,
                    ),
                ),
            )
        } ?: fallbackStoreForecast

        val demandSensing = selectedProduct?.let { product ->
            loadRemote(
                remote = { forecastingApi?.demandSensing(product.id) },
                fallback = DemandSensingDto(
                    modelType = "prophet",
                    horizon = 14,
                    forecast = listOf(
                        com.retailiq.android.core.model.DemandSensingPointDto("2026-03-30", 12.0),
                        com.retailiq.android.core.model.DemandSensingPointDto("2026-03-31", 13.5),
                        com.retailiq.android.core.model.DemandSensingPointDto("2026-04-01", 14.0),
                    ),
                ),
            )
        } ?: DemandSensingDto(
            modelType = "prophet",
            horizon = 14,
            forecast = emptyList(),
        )

        val storePoints = storeResponse.data.orEmpty()
        val storeMeta = storeResponse.meta.orEmpty()
        val skuPoints = skuResponse.data.orEmpty()
        val skuMeta = skuResponse.meta.orEmpty()
        val reorderSuggestion = storeMeta["reorder_suggestion"] as? Map<*, *>
            ?: skuMeta["reorder_suggestion"] as? Map<*, *>
            ?: emptyMap<String, Any?>()

        fun extractDouble(key: String, default: Double = 0.0): Double {
            val number = reorderSuggestion[key] as? Number ?: return default
            return number.toDouble()
        }

        fun extractInt(key: String, default: Int = 0): Int {
            val number = reorderSuggestion[key] as? Number ?: return default
            return number.toInt()
        }

        val storeHistorical = listOf(
            ForecastHistoricalPoint("2026-03-24", 11200.0),
            ForecastHistoricalPoint("2026-03-25", 11800.0),
            ForecastHistoricalPoint("2026-03-26", 12150.0),
            ForecastHistoricalPoint("2026-03-27", 12940.0),
        )

        return ForecastingSnapshot(
            headline = "Forecasts are live for ${selectedProduct?.name ?: "the store"} and reflect the ${skuMeta["model_type"] ?: storeMeta["model_type"] ?: "current"} model.",
            storeLabel = "Store forecast horizon: ${storeMeta["training_window_days"] ?: 7} days",
            skuLabel = "SKU focus: ${skuMeta["product_name"] ?: selectedProduct?.name ?: "Cold Brew Bottle"}",
            historical = storeHistorical,
            storeForecast = storePoints.map { point ->
                ForecastPoint(
                    date = point.date,
                    forecastMean = point.predicted,
                    lowerBound = point.lowerBound ?: point.predicted,
                    upperBound = point.upperBound ?: point.predicted,
                )
            },
            skuForecast = skuPoints.map { point ->
                ForecastPoint(
                    date = point.date,
                    forecastMean = point.predicted,
                    lowerBound = point.lowerBound ?: point.predicted,
                    upperBound = point.upperBound ?: point.predicted,
                )
            },
            suggestion = ForecastSuggestion(
                shouldReorder = reorderSuggestion["should_reorder"] as? Boolean ?: true,
                currentStock = extractDouble("current_stock", selectedProduct?.stock?.toDouble() ?: 0.0),
                forecastedDemand = extractDouble("forecasted_demand", 0.0),
                leadTimeDays = extractInt("lead_time_days", 3),
                leadTimeDemand = extractDouble("lead_time_demand", 0.0),
                suggestedOrderQty = extractDouble("suggested_order_qty", 0.0),
            ),
            signals = buildList {
                demandSensing.forecast.take(3).forEach { point ->
                    add("${demandSensing.modelType} demand sensing for ${point.date}: ${point.value}")
                }
                if (skuPoints.isNotEmpty()) {
                    add("Live SKU forecast is synced for ${skuMeta["product_name"] ?: selectedProduct?.name}.")
                }
                if (storePoints.isNotEmpty()) {
                    add("Store forecast model: ${storeMeta["regime"] ?: "stable"} / ${storeMeta["model_type"] ?: "prophet"}.")
                }
            }.ifEmpty {
                listOf("Demand sensing is not available right now, so the fallback forecast is still shown.")
            },
        )
    }

    suspend fun receiptsSnapshot(): ReceiptsSnapshot {
        val template = loadRemote(
            remote = { receiptsApi?.template() },
            fallback = ReceiptTemplateDto(
                id = null,
                storeId = 1L,
                headerText = "RetailIQ Standard",
                footerText = "Thanks for shopping with RetailIQ.",
                showGstin = true,
                paperWidthMm = 80,
                updatedAt = null,
            ),
        )

        return ReceiptsSnapshot(
            template = ReceiptTemplateSnapshot(
                templateName = template.headerText?.ifBlank { "RetailIQ Standard" } ?: "RetailIQ Standard",
                status = if (template.updatedAt == null) "Default" else "Live",
                footerText = template.footerText?.ifBlank { "Thanks for shopping with RetailIQ." } ?: "Thanks for shopping with RetailIQ.",
                paperWidthMm = template.paperWidthMm ?: 80,
                taxVisibility = if (template.showGstin) "GST visible" else "GST hidden",
                logoMode = if (template.id == null) "Inline" else "Live template",
            ),
            jobs = listOf(
                PrintJobSummary("#RJ-1001", "Thermal Printer 01", "Queued", "2026-03-29 18:02", "Sale complete"),
                PrintJobSummary("#RJ-1002", "Thermal Printer 02", "Printed", "2026-03-29 17:41", "Return receipt"),
                PrintJobSummary("#RJ-1003", "Digital fallback", "Failed", "2026-03-29 17:05", "Printer offline"),
            ),
            notes = listOf(
                "Template edits should keep tax lines visible for audit checks.",
                "A live print job can be triggered from this screen when the user is connected.",
            ),
        )
    }

    suspend fun createReceiptPrintJob(
        transactionId: String? = null,
        printerMacAddress: String? = null,
    ): PrintJobSummary {
        val fallback = PrintJobSummary(
            jobId = "#RJ-DEMO",
            destination = "Digital fallback",
            status = "Queued",
            createdAt = java.time.Instant.now().toString(),
            trigger = if (transactionId != null) "Receipt print" else "Fallback print",
        )

        val api = receiptsApi ?: return fallback
        val created = runCatching {
            api.print(
                mapOf(
                    "transaction_id" to transactionId,
                    "printer_mac_address" to printerMacAddress,
                ),
            )
        }.getOrNull() ?: return fallback

        val jobId = (created.data?.get("job_id") as? Number)?.toLong() ?: return fallback
        val job = loadRemote(
            remote = { api.printJob(jobId) },
            fallback = PrintJobDto(
                jobId = jobId,
                storeId = currentSession()?.storeId ?: 1L,
                transactionId = transactionId,
                jobType = if (transactionId != null) "RECEIPT" else "BARCODE",
                status = "PENDING",
                createdAt = java.time.Instant.now().toString(),
                completedAt = null,
            ),
        )

        return job.toSummary()
    }

    suspend fun developerSnapshot(): DeveloperConsoleSnapshot {
        val liveApps = loadRemote(
            remote = { developerApi?.apps() },
            fallback = listOf(
                DeveloperAppDto(1L, "app_retailiq_pos", null, "POS Sync", "Mobile sync", "BACKEND", listOf(), listOf("read:inventory"), "ACTIVE", "standard", 60, "2026-03-24T12:00:00Z"),
                DeveloperAppDto(2L, "app_partner_bridge", null, "Partner Bridge", "Partner sync", "BACKEND", listOf(), listOf("read:inventory"), "ACTIVE", "standard", 60, "2026-03-20T12:00:00Z"),
            ),
        )
        val liveWebhooks = loadRemote(remote = { developerApi?.webhooks() }, fallback = emptyList<DeveloperWebhookDto>())
        val liveMarketplace = loadRemote(
            remote = { developerApi?.marketplace() },
            fallback = listOf(
                DeveloperMarketplaceDto(1L, "Inventory webhook starter", "Quick start webhook scaffold", "Inventory", "0", 120, "4.8"),
                DeveloperMarketplaceDto(2L, "Sales export bridge", "Export sales to reporting tools", "Reporting", "0", 83, "4.7"),
                DeveloperMarketplaceDto(3L, "Customer loyalty sync", "Push loyalty events to CRM", "CRM", "0", 56, "Preview"),
            ),
        )
        val liveUsage = loadRemote(
            remote = { developerApi?.usage() },
            fallback = DeveloperUsageStatsDto(
                totalRequests = 240,
                totalErrors = 4,
                avgResponseTime = 115.0,
                topEndpoints = listOf(
                    com.retailiq.android.core.model.DeveloperUsageEndpointDto("/api/v1/inventory", 148),
                    com.retailiq.android.core.model.DeveloperUsageEndpointDto("/api/v1/sales", 92),
                ),
                dailyUsage = listOf(),
            ),
        )
        val liveRateLimits = loadRemote(
            remote = { developerApi?.rateLimits() },
            fallback = listOf(
                DeveloperRateLimitDto("/api/v1/developer/apps", "app_retailiq_pos", 12000, 11912, "2026-03-30T00:00:00Z"),
                DeveloperRateLimitDto("/api/v1/developer/webhooks", "app_partner_bridge", 9500, 9405, "2026-03-29T18:00:00Z"),
            ),
        )
        val liveLogs = loadRemote(
            remote = { developerApi?.logs(limit = 5) },
            fallback = DeveloperLogsDto(
                logs = listOf(
                    com.retailiq.android.core.model.DeveloperLogEntryDto("2026-03-29T17:41:00Z", "info", "Webhook delivery succeeded for transaction.created", "req-1", "127.0.0.1", null),
                    com.retailiq.android.core.model.DeveloperLogEntryDto("2026-03-29T16:58:00Z", "warn", "Retry queue observed for one inventory.low_stock event", "req-2", "127.0.0.1", null),
                    com.retailiq.android.core.model.DeveloperLogEntryDto("2026-03-29T15:30:00Z", "info", "API key rotated for Partner Bridge", "req-3", "127.0.0.1", null),
                ),
                total = 3,
            ),
        )

        val webhookClientIds = liveWebhooks.mapNotNull { it.clientId }.toSet()

        return DeveloperConsoleSnapshot(
            registrationHint = "Register integrations, webhooks, and API consumers from the developer shell.",
            apps = liveApps.map { app ->
                DeveloperApplicationSnapshot(
                    appRef = app.clientId,
                    name = app.name,
                    status = app.status.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() },
                    webhookEnabled = webhookClientIds.contains(app.clientId),
                    requestsToday = "${app.rateLimitRpm ?: 0} rpm",
                    secretRotated = app.createdAt?.substring(0, 10) ?: "unknown",
                )
            },
            marketplace = liveMarketplace.map { item ->
                DeveloperMarketplaceSnapshot(
                    title = item.name,
                    category = item.category,
                    status = if (item.price == "0") "Approved" else "Preview",
                )
            },
            usage = listOf(
                DeveloperUsageMetric("Requests", liveUsage.totalRequests.toString(), "Across apps and webhooks"),
                DeveloperUsageMetric("Errors", liveUsage.totalErrors.toString(), "Requests that need attention"),
                DeveloperUsageMetric("Avg latency", "${liveUsage.avgResponseTime} ms", "Backend response time"),
            ),
            rateLimits = liveRateLimits.map { limit ->
                DeveloperRateLimitSnapshot(
                    appName = limit.clientId,
                    budget = "${limit.remaining} / ${limit.limit}",
                    resetLabel = "Resets at ${limit.resetAt}",
                )
            },
            logs = liveLogs.logs.map { log ->
                DeveloperLogEntry(
                    level = log.level.uppercase(),
                    summary = log.message,
                    timestamp = log.timestamp.replace('T', ' ').replace("Z", ""),
                )
            },
            notes = listOf(
                "Use the mobile console for quick checks, not full administration.",
                "Payload signing remains mandatory for webhooks.",
                "Current log total: ${liveLogs.total}.",
            ),
        )
    }

    suspend fun systemStatus(): SystemStatusSnapshot {
        val fallbackHealth = SystemHealthDto(
            status = "ok",
            db = "ok",
            redis = "ok",
        )
        val fallbackPing = TeamPingDto(success = true)

        val health = runCatching { systemApi?.health() }.getOrNull() ?: fallbackHealth
        val ping = runCatching { systemApi?.teamPing() }.getOrNull() ?: fallbackPing

        return SystemStatusSnapshot(
            health = listOf(
                HealthSignal("API", health.status, "Application endpoints are reachable."),
                HealthSignal("Database", health.db, "Primary data store is healthy."),
                HealthSignal("Redis", health.redis, "Cache and queue infrastructure are healthy."),
            ),
            teamPing = if (ping.success) "success" else "degraded",
            notes = listOf(
                "System checks are no-auth and safe to show on a public onboarding device.",
                "A team ping success indicates the shell can reach core services.",
            ),
        )
    }

    suspend fun assistantResponse(query: String): AssistantResponseSnapshot {
        val queryResponse = loadRemote(
            remote = { nlpApi?.query(mapOf("query_text" to query)) },
            fallback = NlpQueryDto(
                intent = "default",
                headline = "Live assistant ready",
                detail = "The assistant query endpoint is not available, so the mobile app is using a local fallback.",
                action = "Review inventory, sales, and alerts manually.",
                supportingMetrics = mapOf("query" to query),
            ),
        )
        val recommendations = loadPlainRemote(
            remote = { nlpApi?.recommend(mapOf("user_id" to currentSession()?.userId)) },
            fallback = NlpRecommendationsDto(
                recommendations = listOf(
                    com.retailiq.android.core.model.RecommendationDto("inventory", "high", null, "Review low stock", "Open the inventory module for low-stock items.", 0.8),
                    com.retailiq.android.core.model.RecommendationDto("sales", "medium", null, "Check margin drift", "Compare discounts against the last seven days.", 0.7),
                ),
            ),
        )

        return AssistantResponseSnapshot(
            query = query,
            intent = queryResponse.intent,
            headline = queryResponse.headline,
            detail = queryResponse.detail,
            action = queryResponse.action,
            metrics = queryResponse.supportingMetrics.entries.map { entry ->
                com.retailiq.android.core.model.ModuleRecord(
                    title = entry.key.replace('_', ' ').replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() },
                    supportingText = "From live assistant metrics",
                    value = entry.value.toString(),
                )
            },
            recommendations = recommendations.recommendations.map { recommendation ->
                "${recommendation.title}: ${recommendation.description}"
            },
        )
    }

    suspend fun uploadInvoiceOcr(invoiceImage: okhttp3.MultipartBody.Part): VisionOcrJobDto {
        val upload = loadPlainRemote(
            remote = { visionApi?.uploadOcr(invoiceImage) },
            fallback = VisionOcrUploadResponseDto(jobId = "local-job"),
        )
        return loadPlainRemote(
            remote = { visionApi?.ocrJob(upload.jobId) },
            fallback = VisionOcrJobDto(
                jobId = upload.jobId,
                status = "QUEUED",
                errorMessage = null,
                items = emptyList(),
            ),
        )
    }

    suspend fun fetchOcrJob(jobId: String): VisionOcrJobDto {
        return loadPlainRemote(
            remote = { visionApi?.ocrJob(jobId) },
            fallback = VisionOcrJobDto(jobId = jobId, status = "QUEUED", errorMessage = null, items = emptyList()),
        )
    }

    suspend fun confirmOcrJob(jobId: String, confirmedItems: List<Map<String, Any?>>): VisionActionResponseDto {
        return loadPlainRemote(
            remote = { visionApi?.confirmOcrJob(jobId, mapOf("confirmed_items" to confirmedItems)) },
            fallback = VisionActionResponseDto(message = "Confirmation queued locally."),
        )
    }

    suspend fun dismissOcrJob(jobId: String): VisionActionResponseDto {
        return loadPlainRemote(
            remote = { visionApi?.dismissOcrJob(jobId) },
            fallback = VisionActionResponseDto(message = "Dismissed locally."),
        )
    }

    suspend fun shelfScan(imageUrl: String): VisionShelfScanDto {
        return loadPlainRemote(
            remote = { visionApi?.shelfScan(mapOf("image_url" to imageUrl)) },
            fallback = VisionShelfScanDto(
                status = "fallback",
                message = "Shelf scan unavailable right now.",
                imageUrl = imageUrl,
                detectedProducts = emptyList(),
                outOfStockSlots = emptyList(),
                complianceScore = 0.0,
                modelInfo = mapOf("model_type" to "fallback"),
            ),
        )
    }

    suspend fun receiptAnalysis(imageUrl: String): VisionReceiptDto {
        val receiptMap = loadRemote(
            remote = { aiV2Api?.receipt(mapOf("image_url" to imageUrl)) },
            fallback = mapOf(
                "raw_text" to "Receipt digitization unavailable right now.",
                "items" to emptyList<Map<String, Any?>>(),
            ),
        )
        val items = receiptMap["items"] as? List<*> ?: emptyList<Any>()
        val typedItems = items.filterIsInstance<Map<String, Any?>>()
        return VisionReceiptDto(
            rawText = receiptMap["raw_text"] as? String ?: "Receipt digitization unavailable right now.",
            items = typedItems,
        )
    }

    suspend fun gstModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val config = loadRemote(
                remote = { api.gstConfig() },
                fallback = mapOf(
                    "gstin" to null,
                    "registration_type" to "REGULAR",
                    "state_code" to null,
                    "is_gst_enabled" to false,
                ),
            )
            val summary = loadRemote(
                remote = { api.gstSummary(currentPeriod()) },
                fallback = mapOf(
                    "period" to currentPeriod(),
                    "total_taxable" to 0,
                    "total_cgst" to 0,
                    "total_sgst" to 0,
                    "total_igst" to 0,
                    "invoice_count" to 0,
                    "status" to "PENDING",
                    "compiled_at" to null,
                ),
            )
            val heroMetric = "${stringValue(summary, "invoice_count", "0")} invoices this period"
            return moduleSpec(
                route = "gst",
                title = "GST",
                subtitle = "Tax setup, filing, and HSN cleanup.",
                backendPrefix = "/api/v1/gst",
                heroMetric = heroMetric,
                description = "Keep GST configuration, filing summary, and HSN mapping details visible from mobile.",
                records = buildList {
                    addAll(recordsFromMap(summary, excludeKeys = setOf("period", "status", "compiled_at")))
                    addAll(recordsFromMap(config))
                },
                actions = listOf(
                    ModuleAction("File GSTR-1", "Open the filing flow for the current period."),
                    ModuleAction("Review HSN codes", "Check tax mapping gaps before month-end."),
                ),
                category = ModuleCategory.Compliance,
            )
        }
        return RetailIqModuleCatalog.module("gst")
    }

    suspend fun loyaltyModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val program = loadRemote(
                remote = { api.loyaltyProgram() },
                fallback = mapOf(
                    "points_per_rupee" to 1,
                    "redemption_rate" to 0.1,
                    "min_redemption_points" to 10,
                    "expiry_days" to 365,
                    "is_active" to true,
                    "tiers" to emptyList<Map<String, Any?>>(),
                ),
            )
            val analytics = loadRemote(
                remote = { api.loyaltyAnalytics() },
                fallback = mapOf(
                    "enrolled_customers" to 0,
                    "points_issued_this_month" to 0.0,
                    "points_redeemed_this_month" to 0.0,
                    "redemption_rate_this_month" to 0.0,
                    "top_customers" to emptyList<Map<String, Any?>>(),
                    "tier_distribution" to emptyList<Map<String, Any?>>(),
                    "monthly_trends" to emptyList<Map<String, Any?>>(),
                ),
            )
            val expiring = loadRemote(remote = { api.loyaltyExpiringPoints() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "loyalty",
                title = "Loyalty",
                subtitle = "Points, tiers, and customer retention actions.",
                backendPrefix = "/api/v1/loyalty",
                heroMetric = "${stringValue(analytics, "enrolled_customers", "0")} enrolled customers",
                description = "Manage earning rules, redemptions, and expiring balances from one mobile surface.",
                records = buildList {
                    addAll(recordsFromMap(program, excludeKeys = setOf("tiers")))
                    addAll(recordsFromMap(analytics, excludeKeys = setOf("top_customers", "tier_distribution", "monthly_trends")))
                    add(ModuleRecord("Expiring accounts", "Points that need a save campaign", expiring.size.toString()))
                },
                actions = listOf(
                    ModuleAction("Adjust points", "Apply manual corrections or goodwill credits."),
                    ModuleAction("Run save campaign", "Message members with expiring balances."),
                ),
                category = ModuleCategory.Growth,
            )
        }
        return RetailIqModuleCatalog.module("loyalty")
    }

    suspend fun creditModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val dashboard = loadPlainRemote(
                remote = { api.financeDashboard() },
                fallback = mapOf(
                    "cash_on_hand" to 0,
                    "treasury_balance" to 0,
                    "total_debt" to 0,
                    "credit_score" to 0,
                ),
            )
            val score = loadPlainRemote(
                remote = { api.creditScore() },
                fallback = mapOf(
                    "score" to 0,
                    "tier" to "UNKNOWN",
                    "factors" to emptyList<Map<String, Any?>>(),
                    "last_updated" to null,
                ),
            )
            val accounts = loadPlainRemote(remote = { api.accounts() }, fallback = emptyList<Map<String, Any?>>())
            val loans = loadPlainRemote(remote = { api.loans() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "credit",
                title = "Credit",
                subtitle = "Merchant credit, treasury, and lending health.",
                backendPrefix = "/api/v2/finance",
                heroMetric = "Score ${stringValue(score, "score", stringValue(dashboard, "credit_score", "0"))}",
                description = "Review balances, lending exposure, and merchant credit signals from the mobile shell.",
                records = buildList {
                    addAll(recordsFromMap(dashboard))
                    addAll(recordsFromMap(score, excludeKeys = setOf("factors")))
                    add(ModuleRecord("Accounts", "Open finance accounts", accounts.size.toString()))
                    add(ModuleRecord("Loans", "Current loan records", loans.size.toString()))
                },
                actions = listOf(
                    ModuleAction("Review ledger", "Inspect operating and reserve balances."),
                    ModuleAction("Open loans", "Check active financing and disbursement status."),
                ),
                category = ModuleCategory.Finance,
            )
        }
        return RetailIqModuleCatalog.module("credit")
    }

    suspend fun kycModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val providers = loadRemote(remote = { api.kycProviders() }, fallback = emptyList<Map<String, Any?>>())
            val status = loadRemote(remote = { api.kycStatus() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "kyc",
                title = "KYC",
                subtitle = "Verification workflows and provider status.",
                backendPrefix = "/api/v1/kyc",
                heroMetric = "${status.size} verification rows",
                description = "Collect and monitor merchant verification providers and the current KYC status trail.",
                records = buildList {
                    providers.take(3).forEach { provider ->
                        add(
                            ModuleRecord(
                                title = stringValue(provider, "name", "Provider"),
                                supportingText = "KYC provider ${stringValue(provider, "code", "unknown")}",
                                value = stringValue(provider, "type", "UNKNOWN"),
                            ),
                        )
                    }
                    status.take(3).forEach { row ->
                        add(
                            ModuleRecord(
                                title = stringValue(row, "provider_name", "Status"),
                                supportingText = stringValue(row, "country_code", "IN"),
                                value = stringValue(row, "status", "UNKNOWN"),
                            ),
                        )
                    }
                },
                actions = listOf(
                    ModuleAction("Verify provider", "Open the verification flow for the chosen provider."),
                    ModuleAction("Review status", "Check the latest submission trail."),
                ),
                category = ModuleCategory.Compliance,
            )
        }
        return RetailIqModuleCatalog.module("kyc")
    }

    suspend fun marketplaceModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val recommendations = loadRemote(remote = { api.marketplaceRecommendations() }, fallback = emptyList<Map<String, Any?>>())
            val orders = loadRemote(
                remote = { api.marketplaceOrders() },
                fallback = mapOf("orders" to emptyList<Map<String, Any?>>(), "total" to 0, "page" to 1, "pages" to 1),
            )
            val orderItems = asStringMapList(orders["orders"])
            return moduleSpec(
                route = "marketplace",
                title = "Marketplace",
                subtitle = "Omnichannel listings and order spillover.",
                backendPrefix = "/api/v1/marketplace",
                heroMetric = "${recommendations.size} live recommendations",
                description = "Track order flow, supplier recommendations, and channel activity from one module.",
                records = buildList {
                    recommendations.take(3).forEach { recommendation ->
                        add(
                            ModuleRecord(
                                title = stringValue(recommendation, "title", "Recommendation"),
                                supportingText = stringValue(recommendation, "type", "Marketplace"),
                                value = stringValue(recommendation, "priority", "MEDIUM"),
                            ),
                        )
                    }
                    add(ModuleRecord("Open orders", "Marketplace order backlog", stringValue(orders, "total", "0")))
                    orderItems.take(3).forEach { order ->
                        add(
                            ModuleRecord(
                                title = stringValue(order, "order_number", "Order"),
                                supportingText = stringValue(order, "status", "Open"),
                                value = stringValue(order, "total", "0"),
                            ),
                        )
                    }
                },
                actions = listOf(
                    ModuleAction("Inspect recommendations", "Open procurement recommendations for review."),
                    ModuleAction("Review orders", "Look at channel orders and tracking status."),
                ),
                category = ModuleCategory.Commerce,
            )
        }
        return RetailIqModuleCatalog.module("marketplace")
    }

    suspend fun chainModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val dashboard = loadRemote(
                remote = { api.chainDashboard() },
                fallback = mapOf(
                    "total_revenue_today" to 0,
                    "best_store" to null,
                    "worst_store" to null,
                    "total_open_alerts" to 0,
                    "per_store_today" to emptyList<Map<String, Any?>>(),
                    "transfer_suggestions" to emptyList<Map<String, Any?>>(),
                ),
            )
            val compare = loadRemote(remote = { api.chainCompare() }, fallback = emptyList<Map<String, Any?>>())
            val transfers = loadRemote(remote = { api.chainTransfers() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "chain",
                title = "Chain",
                subtitle = "Multi-store coordination and headquarters visibility.",
                backendPrefix = "/api/v1/chain",
                heroMetric = "Rs ${stringValue(dashboard, "total_revenue_today", "0")}",
                description = "Surface cross-store operations and transfer opportunities directly on mobile.",
                records = buildList {
                    addAll(recordsFromMap(dashboard, excludeKeys = setOf("per_store_today", "transfer_suggestions")))
                    add(ModuleRecord("Stores compared", "Comparison rows returned", compare.size.toString()))
                    add(ModuleRecord("Transfer queue", "Current transfer suggestions", transfers.size.toString()))
                },
                actions = listOf(
                    ModuleAction("Compare stores", "Benchmark store performance and demand."),
                    ModuleAction("Review transfer ideas", "Move stock before placing a new buy."),
                ),
                category = ModuleCategory.Platform,
            )
        }
        return RetailIqModuleCatalog.module("chain")
    }

    suspend fun pricingModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val suggestions = loadRemote(remote = { api.pricingSuggestions() }, fallback = emptyList<Map<String, Any?>>())
            val rules = loadRemote(remote = { api.pricingRules() }, fallback = emptyList<Map<String, Any?>>())
            val firstSuggestion = suggestions.firstOrNull()
            val history = firstSuggestion?.let { item ->
                asInt(item["product_id"])?.let { productId ->
                    loadRemote(remote = { api.pricingHistory(productId) }, fallback = emptyList<Map<String, Any?>>())
                }
            } ?: emptyList()
            return moduleSpec(
                route = "pricing",
                title = "Pricing",
                subtitle = "Price suggestions and rule control.",
                backendPrefix = "/api/v1/pricing",
                heroMetric = "${suggestions.size} pending suggestions",
                description = "Review price moves, rule configuration, and price history without leaving the mobile app.",
                records = buildList {
                    firstSuggestion?.let { suggestion ->
                        addAll(recordsFromMap(suggestion, excludeKeys = setOf("id", "product_id", "status", "created_at")))
                    }
                    add(ModuleRecord("Pricing rules", "Configured pricing policies", rules.size.toString()))
                    add(ModuleRecord("History rows", "Recent pricing history entries", history.size.toString()))
                },
                actions = listOf(
                    ModuleAction("Approve price change", "Apply the selected suggestion after review."),
                    ModuleAction("Open rules", "Inspect the active pricing rules for the store."),
                ),
                category = ModuleCategory.Commerce,
            )
        }
        return RetailIqModuleCatalog.module("pricing")
    }

    suspend fun decisionsModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val response = loadPlainRemote(
                remote = { api.decisions() },
                fallback = mapOf(
                    "status" to "success",
                    "data" to emptyList<Map<String, Any?>>(),
                    "meta" to mapOf(
                        "execution_time_ms" to 0,
                        "total_recommendations" to 0,
                        "whatsapp_enabled" to false,
                    ),
                ),
            )
            val decisions = asStringMapList(response["data"])
            val meta = asStringMap(response["meta"])
            return moduleSpec(
                route = "decisions",
                title = "Decisions",
                subtitle = "Rules and recommendation acceptance.",
                backendPrefix = "/api/v1/decisions",
                heroMetric = "${stringValue(meta, "total_recommendations", decisions.size.toString())} recommendations",
                description = "Review AI and rules-engine outputs with enough context to accept or reject quickly.",
                records = buildList {
                    addAll(recordsFromMap(meta, limit = 4))
                    decisions.take(3).forEach { decision ->
                        add(
                            ModuleRecord(
                                title = stringValue(decision, "title", "Decision"),
                                supportingText = stringValue(decision, "description", "Backend recommendation"),
                                value = stringValue(decision, "status", stringValue(decision, "priority", "PENDING")),
                            ),
                        )
                    }
                },
                actions = listOf(
                    ModuleAction("Review queue", "Triage pending recommendations."),
                    ModuleAction("Audit accepted actions", "Track what changed and why."),
                ),
                category = ModuleCategory.Platform,
            )
        }
        return RetailIqModuleCatalog.module("decisions")
    }

    suspend fun einvoicingModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val transactions = loadRemote(remote = { transactionsApi?.recentTransactions(5) }, fallback = emptyList<Map<String, Any?>>())
            val latestTxnId = transactions.firstOrNull()?.get("transaction_id")?.toString().orEmpty()
            return moduleSpec(
                route = "einvoicing",
                title = "E-Invoicing",
                subtitle = "Invoice generation and compliance workflows.",
                backendPrefix = "/api/v2/einvoice",
                heroMetric = if (latestTxnId.isNotBlank()) "Latest txn $latestTxnId" else "Awaiting transaction",
                description = "Generate and track e-invoices for completed transactions from a mobile-friendly form.",
                records = buildList {
                    add(ModuleRecord("Recent transactions", "Eligible candidates for invoice generation", transactions.size.toString()))
                    if (latestTxnId.isNotBlank()) {
                        add(ModuleRecord("Latest transaction", "Most recent sale id", latestTxnId))
                    }
                },
                actions = listOf(
                    ModuleAction("Generate invoice", "Use the latest transaction id or open the invoice form."),
                    ModuleAction("Check status", "Lookup an invoice by invoice id."),
                ),
                category = ModuleCategory.Compliance,
            )
        }
        return RetailIqModuleCatalog.module("einvoicing")
    }

    suspend fun eventsModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val events = loadRemote(remote = { api.events() }, fallback = emptyList<Map<String, Any?>>())
            val upcoming = loadRemote(remote = { api.upcomingEvents() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "events",
                title = "Events",
                subtitle = "Promotions, holidays, and demand planning.",
                backendPrefix = "/api/v1/events",
                heroMetric = "${upcoming.size} upcoming events",
                description = "Tie local events to forecast and replenishment decisions from the store shell.",
                records = buildList {
                    add(ModuleRecord("All events", "Store event records returned", events.size.toString()))
                    upcoming.take(3).forEach { event ->
                        add(
                            ModuleRecord(
                                title = stringValue(event, "event_name", "Event"),
                                supportingText = stringValue(event, "event_type", "Scheduled"),
                                value = stringValue(event, "start_date", "TBD"),
                            ),
                        )
                    }
                },
                actions = listOf(
                    ModuleAction("Review calendar", "Inspect upcoming event windows."),
                    ModuleAction("Push into forecast", "Use event data to refine replenishment."),
                ),
                category = ModuleCategory.Growth,
            )
        }
        return RetailIqModuleCatalog.module("events")
    }

    suspend fun whatsappModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val config = loadRemote(remote = { api.whatsappConfig() }, fallback = mapOf("is_active" to false, "configured" to false))
            val templates = loadRemote(remote = { api.whatsappTemplates() }, fallback = emptyList<Map<String, Any?>>())
            val campaigns = loadRemote(remote = { api.whatsappCampaigns() }, fallback = emptyList<Map<String, Any?>>())
            val logs = loadRemote(remote = { api.whatsappLogs() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "whatsapp",
                title = "WhatsApp",
                subtitle = "Campaigns, templates, and operational messaging.",
                backendPrefix = "/api/v1/whatsapp",
                heroMetric = "${campaigns.size} active campaigns",
                description = "Run retention, reorder, or payment reminder messaging from the operator app.",
                records = buildList {
                    addAll(recordsFromMap(config))
                    add(ModuleRecord("Templates", "Approved message templates", templates.size.toString()))
                    add(ModuleRecord("Campaigns", "Configured campaign records", campaigns.size.toString()))
                    add(ModuleRecord("Message log", "Recent WhatsApp message entries", logs.size.toString()))
                },
                actions = listOf(
                    ModuleAction("Send campaign", "Trigger a targeted customer segment message."),
                    ModuleAction("Test template", "Preview delivery before launch."),
                ),
                category = ModuleCategory.Growth,
            )
        }
        return RetailIqModuleCatalog.module("whatsapp")
    }

    suspend fun staffModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val performance = loadRemote(remote = { api.staffPerformance() }, fallback = emptyList<Map<String, Any?>>())
            val currentSession = loadRemote(remote = { api.staffSessionCurrent() }, fallback = mapOf("active" to false))
            val targets = loadRemote(remote = { api.staffTargets() }, fallback = emptyList<Map<String, Any?>>())
            return moduleSpec(
                route = "staff",
                title = "Staff Performance",
                subtitle = "Staff scorecards, leaderboards, and coaching.",
                backendPrefix = "/api/v1/staff",
                heroMetric = "${performance.size} staff score rows",
                description = "Give managers shift-level visibility into sales, service, and attendance trends.",
                records = buildList {
                    addAll(recordsFromMap(currentSession, limit = 4))
                    performance.take(3).forEach { row ->
                        add(
                            ModuleRecord(
                                title = stringValue(row, "name", "Staff"),
                                supportingText = "Today revenue",
                                value = stringValue(row, "today_revenue", "0"),
                            ),
                        )
                    }
                    add(ModuleRecord("Targets", "Target rows configured", targets.size.toString()))
                },
                actions = listOf(
                    ModuleAction("Open leaderboard", "Compare team performance at a glance."),
                    ModuleAction("Review coaching list", "Spot people who need intervention."),
                ),
                category = ModuleCategory.Operations,
            )
        }
        return RetailIqModuleCatalog.module("staff")
    }

    suspend fun offlineModule(): ModuleSpec {
        val api = longTailApi
        if (api != null) {
            val snapshot = loadRemote(
                remote = { api.offlineSnapshot() },
                fallback = mapOf("built_at" to null, "size_bytes" to 0, "snapshot" to emptyMap<String, Any?>()),
            )
            val snapshotPayload = asStringMap(snapshot["snapshot"])
            return moduleSpec(
                route = "offline",
                title = "Offline Sync",
                subtitle = "Queue health, replay, and local safety status.",
                backendPrefix = "/api/v1/offline",
                heroMetric = "${stringValue(snapshot, "size_bytes", "0")} bytes cached",
                description = "Show queue state, retry health, and safe-to-operate guidance for unstable connectivity.",
                records = buildList {
                    addAll(recordsFromMap(snapshot, excludeKeys = setOf("snapshot"), limit = 3))
                    addAll(recordsFromMap(snapshotPayload, limit = 3))
                },
                actions = listOf(
                    ModuleAction("Inspect queue", "Review what is waiting to sync."),
                    ModuleAction("Force replay", "Retry synchronization when connectivity returns."),
                ),
                category = ModuleCategory.Platform,
            )
        }
        return RetailIqModuleCatalog.module("offline")
    }

    suspend fun assistantPrompts(): List<AssistantPrompt> = listOf(
        AssistantPrompt("Restock plan", "What should I reorder before the evening rush?"),
        AssistantPrompt("Margin leak", "Which products are losing margin this week and why?"),
        AssistantPrompt("Festival prep", "How should I adjust inventory for the next local event?"),
        AssistantPrompt("Credit risk", "Which credit customers need a reminder today?"),
    )

    suspend fun modules(): List<ModuleSpec> {
        return RetailIqModuleCatalog.defaultModules()
    }

    suspend fun module(route: String): ModuleSpec {
        return when (route) {
            "gst" -> gstModule()
            "loyalty" -> loyaltyModule()
            "credit" -> creditModule()
            "kyc" -> kycModule()
            "marketplace" -> marketplaceModule()
            "chain" -> chainModule()
            "pricing" -> pricingModule()
            "decisions" -> decisionsModule()
            "einvoicing" -> einvoicingModule()
            "events" -> eventsModule()
            "whatsapp" -> whatsappModule()
            "staff" -> staffModule()
            "offline" -> offlineModule()
            else -> RetailIqModuleCatalog.module(route)
        }
    }

    private suspend fun <T> loadPlainRemote(
        remote: suspend () -> T?,
        fallback: T,
        allowRefresh: Boolean = true,
    ): T {
        return try {
            remote() ?: fallback
        } catch (error: HttpException) {
            if (allowRefresh && error.code() == 401 && refreshSession() != null) {
                loadPlainRemote(remote = remote, fallback = fallback, allowRefresh = false)
            } else {
                fallback
            }
        } catch (_: Exception) {
            fallback
        }
    }

    private suspend fun <T> loadRemote(
        remote: suspend () -> ApiEnvelope<T>?,
        fallback: T,
        allowRefresh: Boolean = true,
    ): T {
        return try {
            remote()?.unwrapOrThrow() ?: fallback
        } catch (error: HttpException) {
            if (allowRefresh && error.code() == 401 && refreshSession() != null) {
                loadRemote(remote = remote, fallback = fallback, allowRefresh = false)
            } else {
                fallback
            }
        } catch (_: Exception) {
            fallback
        }
    }

    private fun StoreProfileDto.toSnapshot(businessHours: String): StoreProfileSnapshot {
        return StoreProfileSnapshot(
            storeId = storeId,
            storeName = storeName,
            storeType = storeType,
            address = address,
            phone = phone,
            gstNumber = gstNumber,
            currency = currency,
            businessHours = businessHours,
        )
    }

    private fun StoreCategoryDto.toSnapshot(): StoreCategorySnapshot {
        return StoreCategorySnapshot(
            categoryId = categoryId,
            name = name,
            gstRate = gstRate,
            productCount = 0,
            active = true,
        )
    }

    private fun PrintJobDto.toSummary(): PrintJobSummary {
        return PrintJobSummary(
            jobId = "#RJ-$jobId",
            destination = if (transactionId != null) "Receipt job" else "Barcode job",
            status = status.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() },
            createdAt = createdAt.replace('T', ' ').replace("Z", ""),
            trigger = if (transactionId != null) "Transaction $transactionId" else "Barcode/receipt print",
        )
    }

    companion object {
        fun create(): RetailIqRepository {
            return buildRepository(InMemorySessionStore())
        }

        fun create(context: Context): RetailIqRepository {
            return buildRepository(EncryptedPreferencesSessionStore(context.applicationContext))
        }

        private fun buildRepository(sessionStore: SessionStore): RetailIqRepository {
            val baseUrl = BuildConfig.RETAILIQ_BASE_URL.trim().removeSuffix("/")
            if (baseUrl.isBlank()) {
                return RetailIqRepository(
                    sessionStore = sessionStore,
                    authApi = null,
                    dashboardApi = null,
                storeApi = null,
                inventoryApi = null,
                customersApi = null,
                suppliersApi = null,
                forecastingApi = null,
                receiptsApi = null,
                developerApi = null,
                nlpApi = null,
                visionApi = null,
                aiV2Api = null,
                transactionsApi = null,
                analyticsApi = null,
                operationsApi = null,
                systemApi = null,
                longTailApi = null,
            )
            }

            val moshi = Moshi.Builder()
                .add(KotlinJsonAdapterFactory())
                .build()

            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BASIC
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(AuthHeaderInterceptor(sessionStore))
                .addInterceptor(logging)
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl("$baseUrl/")
                .client(client)
                .addConverterFactory(MoshiConverterFactory.create(moshi))
                .build()

            return RetailIqRepository(
                sessionStore = sessionStore,
                authApi = retrofit.create(AuthApi::class.java),
                dashboardApi = retrofit.create(DashboardApi::class.java),
                storeApi = retrofit.create(StoreApi::class.java),
                inventoryApi = retrofit.create(InventoryApi::class.java),
                customersApi = retrofit.create(CustomersApi::class.java),
                suppliersApi = retrofit.create(SuppliersApi::class.java),
                forecastingApi = retrofit.create(ForecastingApi::class.java),
                receiptsApi = retrofit.create(ReceiptsApi::class.java),
                developerApi = retrofit.create(DeveloperApi::class.java),
                nlpApi = retrofit.create(NlpApi::class.java),
                visionApi = retrofit.create(VisionApi::class.java),
                aiV2Api = retrofit.create(AiV2Api::class.java),
                transactionsApi = retrofit.create(TransactionsApi::class.java),
                analyticsApi = retrofit.create(AnalyticsApi::class.java),
                operationsApi = retrofit.create(OperationsApi::class.java),
                systemApi = retrofit.create(SystemApi::class.java),
                longTailApi = retrofit.create(LongTailApi::class.java),
            )
        }
    }
}
