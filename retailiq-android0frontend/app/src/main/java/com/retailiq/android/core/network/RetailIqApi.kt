package com.retailiq.android.core.network

import com.retailiq.android.core.model.AnalyticsSummary
import com.retailiq.android.core.model.ApiEnvelope
import com.retailiq.android.core.model.AuthRequest
import com.retailiq.android.core.model.AuthRefreshRequest
import com.retailiq.android.core.model.AuthRefreshResponse
import com.retailiq.android.core.model.AuthResponse
import com.retailiq.android.core.model.DashboardAlertsDto
import com.retailiq.android.core.model.DashboardForecastsDto
import com.retailiq.android.core.model.DashboardIncidentsDto
import com.retailiq.android.core.model.DashboardInventoryProductDto
import com.retailiq.android.core.model.DashboardOverviewDto
import com.retailiq.android.core.model.DashboardSignalsDto
import com.retailiq.android.core.model.CustomerAnalyticsDto
import com.retailiq.android.core.model.CustomerListItemDto
import com.retailiq.android.core.model.CustomerSummaryDto
import com.retailiq.android.core.model.TopCustomerDto
import com.retailiq.android.core.model.DeveloperAppDto
import com.retailiq.android.core.model.DeveloperLogEntryDto
import com.retailiq.android.core.model.DeveloperLogsDto
import com.retailiq.android.core.model.DeveloperMarketplaceDto
import com.retailiq.android.core.model.DeveloperRateLimitDto
import com.retailiq.android.core.model.DeveloperUsageStatsDto
import com.retailiq.android.core.model.DeveloperWebhookDto
import com.retailiq.android.core.model.DemandSensingDto
import com.retailiq.android.core.model.DemandSensingPointDto
import com.retailiq.android.core.model.ForecastMetaDto
import com.retailiq.android.core.model.ForecastPointDto
import com.retailiq.android.core.model.ForecastReorderSuggestionDto
import com.retailiq.android.core.model.ModuleSpec
import com.retailiq.android.core.model.NlpQueryDto
import com.retailiq.android.core.model.NlpRecommendationsDto
import com.retailiq.android.core.model.NlpResponseDto
import com.retailiq.android.core.model.SalesDraft
import com.retailiq.android.core.model.ReceiptTemplateDto
import com.retailiq.android.core.model.PrintJobDto
import com.retailiq.android.core.model.StoreCategoryDto
import com.retailiq.android.core.model.StoreProfileDto
import com.retailiq.android.core.model.StoreTaxConfigDto
import com.retailiq.android.core.model.SupplierDetailDto
import com.retailiq.android.core.model.SupplierListItemDto
import com.retailiq.android.core.model.TeamPingDto
import com.retailiq.android.core.model.VisionActionResponseDto
import com.retailiq.android.core.model.VisionOcrJobDto
import com.retailiq.android.core.model.VisionOcrUploadResponseDto
import com.retailiq.android.core.model.VisionReceiptDto
import com.retailiq.android.core.model.VisionShelfScanDto
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.PATCH
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Query

interface AuthApi {
    @POST("/api/v1/auth/login")
    suspend fun login(@Body body: AuthRequest): ApiEnvelope<AuthResponse>

    @POST("/api/v1/auth/refresh")
    suspend fun refresh(@Body body: AuthRefreshRequest): ApiEnvelope<AuthRefreshResponse>

    @POST("/api/v1/auth/register")
    suspend fun register(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v1/auth/verify-otp")
    suspend fun verifyOtp(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v1/auth/forgot-password")
    suspend fun forgotPassword(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>
}

interface DashboardApi {
    @GET("/api/v1/dashboard/overview")
    suspend fun overview(): ApiEnvelope<DashboardOverviewDto>

    @GET("/api/v1/dashboard/alerts")
    suspend fun alerts(
        @Query("limit") limit: Int? = null,
        @Query("cursor") cursor: String? = null,
    ): ApiEnvelope<DashboardAlertsDto>

    @GET("/api/v1/dashboard/live-signals")
    suspend fun liveSignals(): ApiEnvelope<DashboardSignalsDto>

    @GET("/api/v1/dashboard/forecasts/stores")
    suspend fun storeForecasts(): ApiEnvelope<DashboardForecastsDto>

    @GET("/api/v1/dashboard/incidents/active")
    suspend fun activeIncidents(): ApiEnvelope<DashboardIncidentsDto>

    @GET("/api/v1/dashboard/alerts/feed")
    suspend fun alertsFeed(
        @Query("limit") limit: Int? = null,
        @Query("offset") offset: Int? = null,
    ): ApiEnvelope<DashboardAlertsDto>
}

interface InventoryApi {
    @GET("/api/v1/inventory")
    suspend fun products(
        @Query("page") page: Int? = null,
        @Query("page_size") pageSize: Int? = null,
        @Query("low_stock") lowStock: Boolean? = null,
        @Query("slow_moving") slowMoving: Boolean? = null,
    ): ApiEnvelope<List<DashboardInventoryProductDto>>

    @GET("/api/v1/inventory/{productId}")
    suspend fun product(@Path("productId") productId: Long): ApiEnvelope<DashboardInventoryProductDto>

    @POST("/api/v1/inventory/{productId}/stock-update")
    suspend fun updateStock(
        @Path("productId") productId: Long,
        @Body body: Map<String, Any?>,
    ): ApiEnvelope<DashboardInventoryProductDto>

    @POST("/api/v1/inventory/{productId}/stock")
    suspend fun stockUpdate(
        @Path("productId") productId: Long,
        @Body body: Map<String, Any?>,
    ): ApiEnvelope<DashboardInventoryProductDto>

    @POST("/api/v1/inventory/stock-audit")
    suspend fun stockAudit(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v1/inventory/audit")
    suspend fun audit(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/inventory/{productId}/price-history")
    suspend fun priceHistory(@Path("productId") productId: Long): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/inventory/alerts")
    suspend fun alerts(): ApiEnvelope<List<Map<String, Any?>>>
}

interface CustomersApi {
    @GET("/api/v1/customers")
    suspend fun listCustomers(
        @Query("page") page: Int? = null,
        @Query("page_size") pageSize: Int? = null,
        @Query("name") name: String? = null,
        @Query("mobile") mobile: String? = null,
        @Query("created_after") createdAfter: String? = null,
        @Query("created_before") createdBefore: String? = null,
    ): ApiEnvelope<List<CustomerListItemDto>>

    @GET("/api/v1/customers/{customerId}")
    suspend fun customer(@Path("customerId") customerId: Long): ApiEnvelope<CustomerListItemDto>

    @GET("/api/v1/customers/{customerId}/summary")
    suspend fun summary(@Path("customerId") customerId: Long): ApiEnvelope<CustomerSummaryDto>

    @GET("/api/v1/customers/{customerId}/transactions")
    suspend fun transactions(
        @Path("customerId") customerId: Long,
        @Query("page") page: Int? = null,
        @Query("page_size") pageSize: Int? = null,
        @Query("date_from") dateFrom: String? = null,
        @Query("date_to") dateTo: String? = null,
    ): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/customers/top")
    suspend fun topCustomers(
        @Query("metric") metric: String? = null,
        @Query("limit") limit: Int? = null,
    ): ApiEnvelope<List<TopCustomerDto>>

    @GET("/api/v1/customers/analytics")
    suspend fun analytics(): ApiEnvelope<CustomerAnalyticsDto>
}

interface SuppliersApi {
    @GET("/api/v1/suppliers")
    suspend fun suppliers(): ApiEnvelope<List<SupplierListItemDto>>

    @GET("/api/v1/suppliers/{supplierId}")
    suspend fun supplier(@Path("supplierId") supplierId: String): ApiEnvelope<SupplierDetailDto>

    @GET("/api/v1/suppliers/{supplierId}/products")
    suspend fun supplierProducts(@Path("supplierId") supplierId: String): ApiEnvelope<List<Map<String, Any?>>>

    @POST("/api/v1/suppliers")
    suspend fun createSupplier(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @PUT("/api/v1/suppliers/{supplierId}")
    suspend fun updateSupplier(@Path("supplierId") supplierId: String, @Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @DELETE("/api/v1/suppliers/{supplierId}")
    suspend fun deleteSupplier(@Path("supplierId") supplierId: String): ApiEnvelope<Map<String, Any?>>
}

interface TransactionsApi {
    @GET("/api/v1/transactions/summary/daily")
    suspend fun draft(): ApiEnvelope<SalesDraft>

    @GET("/api/v1/transactions")
    suspend fun recentTransactions(
        @Query("page_size") pageSize: Int = 10,
    ): ApiEnvelope<List<Map<String, Any?>>>
}

interface AnalyticsApi {
    @GET("/api/v1/analytics/dashboard")
    suspend fun summary(): ApiEnvelope<AnalyticsSummary>
}

interface NlpApi {
    @POST("/api/v1/nlp")
    suspend fun query(@Body body: Map<String, Any?>): ApiEnvelope<NlpQueryDto>

    @POST("/api/v1/nlp/v2/ai/recommend")
    suspend fun recommend(@Body body: Map<String, Any?>): NlpRecommendationsDto
}

interface ForecastingApi {
    @GET("/api/v1/forecasting/store")
    suspend fun storeForecast(@Query("horizon") horizon: Int = 7): ApiEnvelope<List<ForecastPointDto>>

    @GET("/api/v1/forecasting/sku/{productId}")
    suspend fun skuForecast(
        @Path("productId") productId: Long,
        @Query("horizon") horizon: Int = 7,
    ): ApiEnvelope<List<ForecastPointDto>>

    @GET("/api/v1/forecasting/demand-sensing/{productId}")
    suspend fun demandSensing(@Path("productId") productId: Long): ApiEnvelope<DemandSensingDto>
}

interface StoreApi {
    @GET("/api/v1/store/profile")
    suspend fun profile(): ApiEnvelope<StoreProfileDto>

    @GET("/api/v1/store/categories")
    suspend fun categories(): ApiEnvelope<List<StoreCategoryDto>>

    @GET("/api/v1/store/tax-config")
    suspend fun taxConfig(): ApiEnvelope<StoreTaxConfigDto>
}

interface OperationsApi {
    @GET(OPS_MAINTENANCE_PATH)
    suspend fun maintenance(): Map<String, Any?>
}

interface LongTailApi {
    @GET("/api/v1/barcodes/lookup")
    suspend fun barcodeLookup(@Query("value") value: String): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/barcodes/list")
    suspend fun barcodeList(@Query("product_id") productId: Long): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/gst/config")
    suspend fun gstConfig(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/gst/summary")
    suspend fun gstSummary(@Query("period") period: String): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/gst/hsn-search")
    suspend fun gstHsnSearch(@Query("q") query: String): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/loyalty/program")
    suspend fun loyaltyProgram(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/loyalty/analytics")
    suspend fun loyaltyAnalytics(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/loyalty/expiring-points")
    suspend fun loyaltyExpiringPoints(@Query("days") days: Int = 30): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v2/finance/treasury/balance")
    suspend fun treasuryBalance(): Map<String, Any?>

    @GET("/api/v2/finance/treasury/config")
    suspend fun treasuryConfig(): Map<String, Any?>

    @GET("/api/v2/finance/treasury/transactions")
    suspend fun treasuryTransactions(): List<Map<String, Any?>>

    @GET("/api/v2/finance/dashboard")
    suspend fun financeDashboard(): Map<String, Any?>

    @GET("/api/v2/finance/credit-score")
    suspend fun creditScore(): Map<String, Any?>

    @GET("/api/v2/finance/accounts")
    suspend fun accounts(): List<Map<String, Any?>>

    @GET("/api/v2/finance/ledger")
    suspend fun ledger(): List<Map<String, Any?>>

    @GET("/api/v2/finance/loans")
    suspend fun loans(): List<Map<String, Any?>>

    @GET("/api/v1/kyc/kyc/providers")
    suspend fun kycProviders(@Query("country_code") countryCode: String = "IN"): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/kyc/kyc/status")
    suspend fun kycStatus(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/i18n/i18n/translations")
    suspend fun translations(
        @Query("locale") locale: String = "en",
        @Query("module") module: String? = null,
    ): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/i18n/i18n/currencies")
    suspend fun currencies(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/i18n/i18n/countries")
    suspend fun countries(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/market/summary")
    suspend fun marketSummary(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/market/signals")
    suspend fun marketSignals(
        @Query("category_id") categoryId: Int? = null,
        @Query("signal_type") signalType: String? = null,
        @Query("limit") limit: Int = 20,
    ): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/market/indices")
    suspend fun marketIndices(
        @Query("category_id") categoryId: Int? = null,
        @Query("days") days: Int = 30,
    ): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/market/alerts")
    suspend fun marketAlerts(
        @Query("unacknowledged_only") unacknowledgedOnly: Boolean = true,
    ): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/market/competitors")
    suspend fun marketCompetitors(@Query("region") region: String? = null): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/market/recommendations")
    suspend fun marketRecommendations(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/marketplace/recommendations")
    suspend fun marketplaceRecommendations(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/marketplace/orders")
    suspend fun marketplaceOrders(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/marketplace/suppliers/dashboard")
    suspend fun marketplaceSupplierDashboard(@Query("supplier_id") supplierId: Int): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/chain/dashboard")
    suspend fun chainDashboard(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/chain/compare")
    suspend fun chainCompare(@Query("period") period: String = "today"): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/chain/transfers")
    suspend fun chainTransfers(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/pricing/suggestions")
    suspend fun pricingSuggestions(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/pricing/rules")
    suspend fun pricingRules(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/pricing/history")
    suspend fun pricingHistory(@Query("product_id") productId: Int): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/tax/config")
    suspend fun taxConfig(@Query("country_code") countryCode: String = "IN"): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/tax/filing-summary")
    suspend fun taxFilingSummary(
        @Query("period") period: String,
        @Query("country_code") countryCode: String = "IN",
    ): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/decisions")
    suspend fun decisions(): Map<String, Any?>

    @POST("/api/v2/einvoice/generate")
    suspend fun generateEinvoice(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v2/einvoice/status/{invoiceId}")
    suspend fun einvoiceStatus(@Path("invoiceId") invoiceId: String): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/events")
    suspend fun events(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/events/upcoming")
    suspend fun upcomingEvents(@Query("days") days: Int = 30): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/events/forecasting/demand-sensing/{productId}")
    suspend fun eventDemandSensing(@Path("productId") productId: Int): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/whatsapp/config")
    suspend fun whatsappConfig(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/whatsapp/templates")
    suspend fun whatsappTemplates(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/whatsapp/campaigns")
    suspend fun whatsappCampaigns(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/whatsapp/message-log")
    suspend fun whatsappLogs(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/staff/performance")
    suspend fun staffPerformance(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/staff/sessions/current")
    suspend fun staffSessionCurrent(): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/staff/targets")
    suspend fun staffTargets(): ApiEnvelope<List<Map<String, Any?>>>

    @GET("/api/v1/offline/snapshot")
    suspend fun offlineSnapshot(): ApiEnvelope<Map<String, Any?>>
}

interface ReceiptsApi {
    @GET("/api/v1/receipts/template")
    suspend fun template(): ApiEnvelope<ReceiptTemplateDto>

    @PUT("/api/v1/receipts/template")
    suspend fun updateTemplate(@Body body: Map<String, Any?>): ApiEnvelope<ReceiptTemplateDto>

    @POST("/api/v1/receipts/print")
    suspend fun print(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/receipts/print/{jobId}")
    suspend fun printJob(@Path("jobId") jobId: Long): ApiEnvelope<PrintJobDto>
}

interface VisionApi {
    @Multipart
    @POST("/api/v1/vision/ocr/upload")
    suspend fun uploadOcr(@Part invoiceImage: okhttp3.MultipartBody.Part): VisionOcrUploadResponseDto

    @GET("/api/v1/vision/ocr/{jobId}")
    suspend fun ocrJob(@Path("jobId") jobId: String): VisionOcrJobDto

    @POST("/api/v1/vision/ocr/{jobId}/confirm")
    suspend fun confirmOcrJob(
        @Path("jobId") jobId: String,
        @Body body: Map<String, Any?>,
    ): VisionActionResponseDto

    @POST("/api/v1/vision/ocr/{jobId}/dismiss")
    suspend fun dismissOcrJob(@Path("jobId") jobId: String): VisionActionResponseDto

    @POST("/api/v1/vision/shelf-scan")
    suspend fun shelfScan(@Body body: Map<String, Any?>): VisionShelfScanDto

    @POST("/api/v1/vision/receipt")
    suspend fun receipt(@Body body: Map<String, Any?>): VisionReceiptDto
}

interface AiV2Api {
    @POST("/api/v2/ai/forecast")
    suspend fun forecast(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v2/ai/vision/shelf-scan")
    suspend fun shelfScan(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v2/ai/vision/receipt")
    suspend fun receipt(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v2/ai/nlp/query")
    suspend fun query(@Body body: Map<String, Any?>): Map<String, Any?>

    @POST("/api/v2/ai/recommend")
    suspend fun recommend(@Body body: Map<String, Any?>): Map<String, Any?>

    @POST("/api/v2/ai/pricing/optimize")
    suspend fun pricingOptimize(@Body body: Map<String, Any?>): ApiEnvelope<List<Map<String, Any?>>>
}

interface DeveloperApi {
    @POST("/api/v1/developer/register")
    suspend fun register(@Body body: Map<String, Any?>): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/developer/apps")
    suspend fun apps(): ApiEnvelope<List<DeveloperAppDto>>

    @POST("/api/v1/developer/apps")
    suspend fun createApp(@Body body: Map<String, Any?>): ApiEnvelope<DeveloperAppDto>

    @PATCH("/api/v1/developer/apps/{appRef}")
    suspend fun updateApp(@Path("appRef") appRef: String, @Body body: Map<String, Any?>): ApiEnvelope<DeveloperAppDto>

    @DELETE("/api/v1/developer/apps/{appRef}")
    suspend fun deleteApp(@Path("appRef") appRef: String): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v1/developer/apps/{appRef}/regenerate-secret")
    suspend fun regenerateSecret(@Path("appRef") appRef: String): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/developer/webhooks")
    suspend fun webhooks(): ApiEnvelope<List<DeveloperWebhookDto>>

    @POST("/api/v1/developer/webhooks")
    suspend fun createWebhook(@Body body: Map<String, Any?>): ApiEnvelope<DeveloperWebhookDto>

    @PATCH("/api/v1/developer/webhooks/{appRef}")
    suspend fun updateWebhook(@Path("appRef") appRef: String, @Body body: Map<String, Any?>): ApiEnvelope<DeveloperWebhookDto>

    @DELETE("/api/v1/developer/webhooks/{appRef}")
    suspend fun deleteWebhook(@Path("appRef") appRef: String): ApiEnvelope<Map<String, Any?>>

    @POST("/api/v1/developer/webhooks/{appRef}/test")
    suspend fun testWebhook(@Path("appRef") appRef: String): ApiEnvelope<Map<String, Any?>>

    @GET("/api/v1/developer/usage")
    suspend fun usage(
        @Query("from_date") fromDate: String? = null,
        @Query("to_date") toDate: String? = null,
    ): ApiEnvelope<DeveloperUsageStatsDto>

    @GET("/api/v1/developer/rate-limits")
    suspend fun rateLimits(): ApiEnvelope<List<DeveloperRateLimitDto>>

    @GET("/api/v1/developer/logs")
    suspend fun logs(
        @Query("from_date") fromDate: String? = null,
        @Query("to_date") toDate: String? = null,
        @Query("level") level: String? = null,
        @Query("limit") limit: Int? = null,
    ): ApiEnvelope<DeveloperLogsDto>

    @GET("/api/v1/developer/marketplace")
    suspend fun marketplace(): ApiEnvelope<List<DeveloperMarketplaceDto>>
}

interface SystemApi {
    @GET(HEALTH_PATH)
    suspend fun health(): Map<String, Any?>

    @GET(TEAM_PING_PATH)
    suspend fun teamPing(): TeamPingDto
}
