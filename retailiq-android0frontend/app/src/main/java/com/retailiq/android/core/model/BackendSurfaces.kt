package com.retailiq.android.core.model

import com.squareup.moshi.Json

data class StoreProfileSnapshot(
    @Json(name = "store_id") val storeId: Long,
    @Json(name = "store_name") val storeName: String,
    @Json(name = "store_type") val storeType: String,
    val address: String,
    val phone: String,
    @Json(name = "gst_number") val gstNumber: String,
    val currency: String,
    @Json(name = "business_hours") val businessHours: String,
)

data class StoreCategorySnapshot(
    @Json(name = "category_id") val categoryId: Long,
    val name: String,
    @Json(name = "gst_rate") val gstRate: Double,
    @Json(name = "product_count") val productCount: Int,
    val active: Boolean,
)

data class StoreTaxConfigSnapshot(
    val taxes: List<StoreCategorySnapshot>,
)

data class StoreAdminSnapshot(
    val profile: StoreProfileSnapshot,
    val categories: List<StoreCategorySnapshot>,
    val taxConfig: StoreTaxConfigSnapshot,
    val notes: List<String>,
)

data class CustomerProfileSnapshot(
    @Json(name = "customer_id") val customerId: Long,
    val name: String,
    @Json(name = "mobile_number") val mobileNumber: String,
    val segment: String,
    @Json(name = "visit_count") val visitCount: Int,
    @Json(name = "lifetime_spend") val lifetimeSpend: String,
    @Json(name = "last_visit") val lastVisit: String,
    @Json(name = "loyalty_points") val loyaltyPoints: Int,
)

data class CustomerDirectorySnapshot(
    @Json(name = "customer_id") val customerId: Long,
    val name: String,
    @Json(name = "mobile_number") val mobileNumber: String,
    val email: String?,
    @Json(name = "created_at") val createdAt: String?,
)

data class CustomerRankSnapshot(
    @Json(name = "customer_id") val customerId: Long,
    val name: String,
    @Json(name = "mobile_number") val mobileNumber: String,
    val valueLabel: String,
    val note: String,
)

data class CustomerCenterSnapshot(
    val headline: String,
    val metrics: List<DashboardKpi>,
    val topCustomers: List<CustomerRankSnapshot>,
    val directory: List<CustomerDirectorySnapshot>,
    val insights: List<String>,
    val actions: List<String>,
)

data class SupplierProfileSnapshot(
    @Json(name = "supplier_id") val supplierId: Long,
    val name: String,
    val contact: String,
    val phone: String,
    val reliability: String,
    @Json(name = "open_pos") val openPurchaseOrders: Int,
    @Json(name = "lead_time_days") val leadTimeDays: Int,
    @Json(name = "category_focus") val categoryFocus: String,
)

data class SupplierCenterSnapshot(
    val headline: String,
    val suppliers: List<SupplierProfileSnapshot>,
    val riskNotes: List<String>,
    val actions: List<String>,
)

data class ForecastPoint(
    val date: String,
    @Json(name = "forecast_mean") val forecastMean: Double,
    @Json(name = "lower_bound") val lowerBound: Double,
    @Json(name = "upper_bound") val upperBound: Double,
)

data class ForecastHistoricalPoint(
    val date: String,
    val actual: Double,
)

data class ForecastSuggestion(
    @Json(name = "should_reorder") val shouldReorder: Boolean,
    @Json(name = "current_stock") val currentStock: Double,
    @Json(name = "forecasted_demand") val forecastedDemand: Double,
    @Json(name = "lead_time_days") val leadTimeDays: Int,
    @Json(name = "lead_time_demand") val leadTimeDemand: Double,
    @Json(name = "suggested_order_qty") val suggestedOrderQty: Double,
)

data class ForecastingSnapshot(
    val headline: String,
    val storeLabel: String,
    val skuLabel: String,
    val historical: List<ForecastHistoricalPoint>,
    val storeForecast: List<ForecastPoint>,
    val skuForecast: List<ForecastPoint>,
    val suggestion: ForecastSuggestion,
    val signals: List<String>,
)

data class AssistantResponseSnapshot(
    val query: String,
    val intent: String,
    val headline: String,
    val detail: String,
    val action: String,
    val metrics: List<ModuleRecord>,
    val recommendations: List<String>,
)

data class ReceiptTemplateSnapshot(
    val templateName: String,
    val status: String,
    val footerText: String,
    val paperWidthMm: Int,
    val taxVisibility: String,
    val logoMode: String,
)

data class PrintJobSummary(
    val jobId: String,
    val destination: String,
    val status: String,
    val createdAt: String,
    val trigger: String,
)

data class ReceiptsSnapshot(
    val template: ReceiptTemplateSnapshot,
    val jobs: List<PrintJobSummary>,
    val notes: List<String>,
)

data class DeveloperApplicationSnapshot(
    @Json(name = "app_ref") val appRef: String,
    val name: String,
    val status: String,
    @Json(name = "webhook_enabled") val webhookEnabled: Boolean,
    @Json(name = "requests_today") val requestsToday: String,
    @Json(name = "secret_rotated") val secretRotated: String,
)

data class DeveloperMarketplaceSnapshot(
    val title: String,
    val category: String,
    val status: String,
)

data class DeveloperUsageMetric(
    val title: String,
    val value: String,
    val detail: String,
)

data class DeveloperRateLimitSnapshot(
    val appName: String,
    val budget: String,
    val resetLabel: String,
)

data class DeveloperLogEntry(
    val level: String,
    val summary: String,
    val timestamp: String,
)

data class DeveloperConsoleSnapshot(
    val registrationHint: String,
    val apps: List<DeveloperApplicationSnapshot>,
    val marketplace: List<DeveloperMarketplaceSnapshot>,
    val usage: List<DeveloperUsageMetric>,
    val rateLimits: List<DeveloperRateLimitSnapshot>,
    val logs: List<DeveloperLogEntry>,
    val notes: List<String>,
)

data class HealthSignal(
    val service: String,
    val status: String,
    val detail: String,
)

data class SystemStatusSnapshot(
    val health: List<HealthSignal>,
    val teamPing: String,
    val notes: List<String>,
)
