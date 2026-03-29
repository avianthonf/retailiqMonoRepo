package com.retailiq.android.core.model

import com.squareup.moshi.Json

data class StoreProfileDto(
    @Json(name = "store_id") val storeId: Long,
    @Json(name = "store_name") val storeName: String,
    @Json(name = "store_type") val storeType: String,
    val address: String,
    val phone: String,
    @Json(name = "gst_number") val gstNumber: String,
    val currency: String,
)

data class StoreCategoryDto(
    @Json(name = "category_id") val categoryId: Long,
    val name: String,
    @Json(name = "gst_rate") val gstRate: Double,
)

data class StoreTaxConfigDto(
    val taxes: List<StoreCategoryDto>,
)

data class SystemHealthDto(
    val status: String,
    val db: String,
    val redis: String,
)

data class TeamPingDto(
    val success: Boolean,
)

data class CustomerListItemDto(
    @Json(name = "customer_id") val customerId: Long,
    @Json(name = "store_id") val storeId: Long,
    val name: String,
    @Json(name = "mobile_number") val mobileNumber: String,
    val email: String?,
    val gender: String?,
    @Json(name = "birth_date") val birthDate: String?,
    val address: String?,
    val notes: String?,
    @Json(name = "created_at") val createdAt: String?,
)

data class CustomerSummaryDto(
    @Json(name = "visit_count") val visitCount: Int,
    @Json(name = "last_visit_date") val lastVisitDate: String?,
    @Json(name = "total_lifetime_spend") val totalLifetimeSpend: Double,
    @Json(name = "avg_basket_size") val avgBasketSize: Double,
    @Json(name = "is_repeat_customer") val isRepeatCustomer: Boolean,
)

data class CustomerAnalyticsDto(
    @Json(name = "new_customers") val newCustomers: Int,
    @Json(name = "unique_customers_month") val uniqueCustomersMonth: Int,
    @Json(name = "new_revenue") val newRevenue: Double,
    @Json(name = "repeat_customers") val repeatCustomers: Int,
    @Json(name = "repeat_revenue") val repeatRevenue: Double,
    @Json(name = "repeat_rate_pct") val repeatRatePct: Double,
    @Json(name = "avg_lifetime_value") val avgLifetimeValue: Double,
)

data class TopCustomerDto(
    @Json(name = "customer_id") val customerId: Long,
    val name: String,
    @Json(name = "mobile_number") val mobileNumber: String,
    @Json(name = "visit_count") val visitCount: Int,
    @Json(name = "total_revenue") val totalRevenue: Double,
)

data class SupplierListItemDto(
    val id: String,
    val name: String,
    @Json(name = "contact_name") val contactName: String?,
    val email: String?,
    val phone: String?,
    @Json(name = "payment_terms_days") val paymentTermsDays: Int?,
    @Json(name = "avg_lead_time_days") val avgLeadTimeDays: Double?,
    @Json(name = "fill_rate_90d") val fillRate90d: Double?,
    @Json(name = "price_change_6m_pct") val priceChange6mPct: Double?,
)

data class SupplierContactDto(
    val name: String?,
    val phone: String?,
    val email: String?,
    val address: String?,
)

data class SupplierProductDto(
    @Json(name = "product_id") val productId: Long,
    val name: String,
    @Json(name = "quoted_price") val quotedPrice: Double,
    @Json(name = "lead_time_days") val leadTimeDays: Int?,
)

data class SupplierPurchaseOrderDto(
    val id: String,
    val status: String,
    @Json(name = "expected_delivery_date") val expectedDeliveryDate: String?,
    @Json(name = "created_at") val createdAt: String,
)

data class SupplierDetailDto(
    val id: String,
    val name: String,
    val contact: SupplierContactDto,
    @Json(name = "payment_terms_days") val paymentTermsDays: Int?,
    @Json(name = "is_active") val isActive: Boolean,
    val analytics: SupplierAnalyticsDto?,
    @Json(name = "sourced_products") val sourcedProducts: List<SupplierProductDto> = emptyList(),
    @Json(name = "recent_purchase_orders") val recentPurchaseOrders: List<SupplierPurchaseOrderDto> = emptyList(),
)

data class SupplierAnalyticsDto(
    @Json(name = "avg_lead_time_days") val avgLeadTimeDays: Double?,
    @Json(name = "fill_rate_90d") val fillRate90d: Double?,
)

data class ForecastPointDto(
    val date: String,
    @Json(name = "predicted") val predicted: Double,
    @Json(name = "lower_bound") val lowerBound: Double?,
    @Json(name = "upper_bound") val upperBound: Double?,
)

data class ForecastHistoricalPointDto(
    val date: String,
    @Json(name = "actual") val actual: Double,
)

data class ForecastReorderSuggestionDto(
    @Json(name = "should_reorder") val shouldReorder: Boolean,
    @Json(name = "current_stock") val currentStock: Double,
    @Json(name = "forecasted_demand") val forecastedDemand: Double,
    @Json(name = "lead_time_days") val leadTimeDays: Int,
    @Json(name = "lead_time_demand") val leadTimeDemand: Double,
    @Json(name = "suggested_order_qty") val suggestedOrderQty: Double,
)

data class ForecastMetaDto(
    val regime: String,
    @Json(name = "model_type") val modelType: String,
    @Json(name = "confidence_tier") val confidenceTier: String?,
    @Json(name = "training_window_days") val trainingWindowDays: Int,
    @Json(name = "generated_at") val generatedAt: String,
    @Json(name = "product_id") val productId: Long?,
    @Json(name = "product_name") val productName: String?,
    @Json(name = "reorder_suggestion") val reorderSuggestion: ForecastReorderSuggestionDto? = null,
)

data class DemandSensingPointDto(
    val date: String,
    val value: Double,
)

data class DemandSensingDto(
    @Json(name = "model_type") val modelType: String,
    val horizon: Int,
    val forecast: List<DemandSensingPointDto>,
)

data class ReceiptTemplateDto(
    val id: Long?,
    @Json(name = "store_id") val storeId: Long,
    @Json(name = "header_text") val headerText: String?,
    @Json(name = "footer_text") val footerText: String?,
    @Json(name = "show_gstin") val showGstin: Boolean,
    @Json(name = "paper_width_mm") val paperWidthMm: Int?,
    @Json(name = "updated_at") val updatedAt: String?,
)

data class PrintJobDto(
    @Json(name = "job_id") val jobId: Long,
    @Json(name = "store_id") val storeId: Long,
    @Json(name = "transaction_id") val transactionId: String?,
    @Json(name = "job_type") val jobType: String,
    val status: String,
    @Json(name = "created_at") val createdAt: String,
    @Json(name = "completed_at") val completedAt: String?,
)

data class DeveloperAppDto(
    val id: Long,
    @Json(name = "client_id") val clientId: String,
    @Json(name = "client_secret") val clientSecret: String?,
    val name: String,
    val description: String?,
    @Json(name = "app_type") val appType: String,
    @Json(name = "redirect_uris") val redirectUris: List<String> = emptyList(),
    val scopes: List<String> = emptyList(),
    val status: String,
    val tier: String?,
    @Json(name = "rate_limit_rpm") val rateLimitRpm: Int?,
    @Json(name = "created_at") val createdAt: String?,
)

data class DeveloperWebhookDto(
    val id: String,
    @Json(name = "app_id") val appId: Long,
    @Json(name = "client_id") val clientId: String?,
    val name: String?,
    val url: String,
    val events: List<String> = emptyList(),
    val secret: String,
    @Json(name = "is_active") val isActive: Boolean,
    @Json(name = "last_triggered_at") val lastTriggeredAt: String?,
    @Json(name = "created_at") val createdAt: String?,
    @Json(name = "created_by") val createdBy: String?,
)

data class DeveloperUsageEndpointDto(
    val path: String,
    val requests: Int,
)

data class DeveloperUsageDailyDto(
    val date: String,
    val requests: Int,
    val errors: Int,
    @Json(name = "avg_response_time") val avgResponseTime: Double,
)

data class DeveloperUsageStatsDto(
    @Json(name = "total_requests") val totalRequests: Int,
    @Json(name = "total_errors") val totalErrors: Int,
    @Json(name = "avg_response_time") val avgResponseTime: Double,
    @Json(name = "top_endpoints") val topEndpoints: List<DeveloperUsageEndpointDto> = emptyList(),
    @Json(name = "daily_usage") val dailyUsage: List<DeveloperUsageDailyDto> = emptyList(),
)

data class DeveloperRateLimitDto(
    val endpoint: String,
    @Json(name = "client_id") val clientId: String,
    val limit: Int,
    val remaining: Int,
    @Json(name = "reset_at") val resetAt: String,
)

data class DeveloperLogEntryDto(
    val timestamp: String,
    val level: String,
    val message: String,
    @Json(name = "request_id") val requestId: String,
    @Json(name = "ip_address") val ipAddress: String,
    @Json(name = "user_agent") val userAgent: String?,
)

data class DeveloperLogsDto(
    val logs: List<DeveloperLogEntryDto> = emptyList(),
    val total: Int,
)

data class DeveloperMarketplaceDto(
    val id: Long,
    val name: String,
    val tagline: String?,
    val category: String,
    val price: String,
    @Json(name = "install_count") val installCount: Int,
    @Json(name = "avg_rating") val avgRating: String,
)

data class DashboardSparklinePointDto(
    val timestamp: String,
    val value: Double,
)

data class DashboardSparklineDto(
    val metric: String,
    val points: List<DashboardSparklinePointDto> = emptyList(),
)

data class DashboardOverviewDto(
    val sales: Double,
    @Json(name = "sales_delta") val salesDelta: String,
    @Json(name = "sales_sparkline") val salesSparkline: DashboardSparklineDto,
    @Json(name = "gross_margin") val grossMargin: Double,
    @Json(name = "gross_margin_delta") val grossMarginDelta: String,
    @Json(name = "gross_margin_sparkline") val grossMarginSparkline: DashboardSparklineDto,
    @Json(name = "inventory_at_risk") val inventoryAtRisk: Int,
    @Json(name = "inventory_at_risk_delta") val inventoryAtRiskDelta: String,
    @Json(name = "inventory_at_risk_sparkline") val inventoryAtRiskSparkline: DashboardSparklineDto,
    @Json(name = "outstanding_pos") val outstandingPos: Int,
    @Json(name = "outstanding_pos_delta") val outstandingPosDelta: String,
    @Json(name = "outstanding_pos_sparkline") val outstandingPosSparkline: DashboardSparklineDto,
    @Json(name = "loyalty_redemptions") val loyaltyRedemptions: Int,
    @Json(name = "loyalty_redemptions_delta") val loyaltyRedemptionsDelta: String,
    @Json(name = "loyalty_redemptions_sparkline") val loyaltyRedemptionsSparkline: DashboardSparklineDto,
    @Json(name = "online_orders") val onlineOrders: Int,
    @Json(name = "online_orders_delta") val onlineOrdersDelta: String,
    @Json(name = "online_orders_sparkline") val onlineOrdersSparkline: DashboardSparklineDto,
    @Json(name = "last_updated") val lastUpdated: String,
)

data class DashboardAlertDto(
    val id: String,
    val type: String,
    val severity: String,
    val title: String,
    val message: String,
    val timestamp: String,
    val source: String,
    val acknowledged: Boolean,
    val resolved: Boolean,
)

data class DashboardAlertsDto(
    val alerts: List<DashboardAlertDto> = emptyList(),
    @Json(name = "has_more") val hasMore: Boolean,
    @Json(name = "next_cursor") val nextCursor: String?,
)

data class DashboardSignalDto(
    val id: String,
    val sku: String,
    @Json(name = "product_name") val productName: String,
    val delta: String,
    val region: String,
    val insight: String,
    val recommendation: String,
    val timestamp: String,
)

data class DashboardSignalsDto(
    val signals: List<DashboardSignalDto> = emptyList(),
    @Json(name = "last_updated") val lastUpdated: String,
)

data class DashboardForecastStorePointDto(
    val date: String,
    @Json(name = "predicted_sales") val predictedSales: Double,
    val confidence: Double,
)

data class DashboardForecastStoreDto(
    @Json(name = "store_id") val storeId: Long,
    @Json(name = "store_name") val storeName: String,
    val forecast: List<DashboardForecastStorePointDto> = emptyList(),
    @Json(name = "total_predicted") val totalPredicted: Double,
    val accuracy: Double?,
)

data class DashboardForecastsDto(
    val forecasts: List<DashboardForecastStoreDto> = emptyList(),
)

data class DashboardIncidentsDto(
    val incidents: List<DashboardIncidentDto> = emptyList(),
)

data class DashboardIncidentDto(
    val id: String,
    val title: String,
    val description: String,
    val severity: String,
    val status: String,
    @Json(name = "impacted_services") val impactedServices: List<String> = emptyList(),
    @Json(name = "created_at") val createdAt: String,
    @Json(name = "updated_at") val updatedAt: String,
    @Json(name = "estimated_resolution") val estimatedResolution: String,
)

data class DashboardInventoryProductDto(
    @Json(name = "product_id") val productId: Long,
    val name: String,
    @Json(name = "sku_code") val skuCode: String,
    @Json(name = "category_id") val categoryId: Long?,
    @Json(name = "current_stock") val currentStock: Double,
    @Json(name = "reorder_level") val reorderLevel: Double,
    @Json(name = "selling_price") val sellingPrice: Double,
    @Json(name = "supplier_name") val supplierName: String?,
    val uom: String?,
    @Json(name = "is_active") val isActive: Boolean,
)

data class InventoryAlertDto(
    @Json(name = "alert_id") val alertId: Long,
    @Json(name = "alert_type") val alertType: String,
    val priority: String,
    @Json(name = "product_id") val productId: Long?,
    val message: String,
    @Json(name = "created_at") val createdAt: String?,
)

data class InventoryStockUpdateDto(
    val message: String,
    val product: DashboardInventoryProductDto,
)

data class InventoryStockAuditItemDto(
    @Json(name = "product_id") val productId: Long,
    @Json(name = "expected_stock") val expectedStock: Double,
    @Json(name = "actual_stock") val actualStock: Double,
    val discrepancy: Double,
)

data class InventoryStockAuditDto(
    @Json(name = "audit_id") val auditId: Long,
    @Json(name = "audit_date") val auditDate: String,
    val items: List<InventoryStockAuditItemDto> = emptyList(),
)

data class InventoryPriceHistoryDto(
    val id: Long,
    @Json(name = "cost_price") val costPrice: Double?,
    @Json(name = "selling_price") val sellingPrice: Double?,
    @Json(name = "changed_at") val changedAt: String?,
    @Json(name = "changed_by") val changedBy: Long?,
)

data class NlpQueryDto(
    val intent: String,
    val headline: String,
    val detail: String,
    val action: String,
    @Json(name = "supporting_metrics") val supportingMetrics: Map<String, Any?> = emptyMap(),
)

data class NlpResponseDto(
    val response: String,
)

data class NlpRecommendationsDto(
    val recommendations: List<RecommendationDto> = emptyList(),
)

data class RecommendationDto(
    val type: String,
    val priority: String,
    @Json(name = "product_id") val productId: Long?,
    val title: String,
    val description: String,
    val confidence: Double,
)

data class VisionOcrItemDto(
    @Json(name = "item_id") val itemId: String,
    @Json(name = "raw_text") val rawText: String,
    @Json(name = "matched_product_id") val matchedProductId: Long?,
    @Json(name = "product_name") val productName: String?,
    val confidence: Double?,
    val quantity: Double?,
    @Json(name = "unit_price") val unitPrice: Double?,
    @Json(name = "is_confirmed") val isConfirmed: Boolean,
)

data class VisionOcrJobDto(
    @Json(name = "job_id") val jobId: String,
    val status: String,
    @Json(name = "error_message") val errorMessage: String?,
    val items: List<VisionOcrItemDto> = emptyList(),
)

data class VisionShelfScanDto(
    val status: String,
    val message: String?,
    @Json(name = "image_url") val imageUrl: String?,
    @Json(name = "detected_products") val detectedProducts: List<Map<String, Any?>> = emptyList(),
    @Json(name = "out_of_stock_slots") val outOfStockSlots: List<Map<String, Any?>> = emptyList(),
    @Json(name = "compliance_score") val complianceScore: Double = 0.0,
    @Json(name = "model_info") val modelInfo: Map<String, Any?>? = null,
)

data class VisionReceiptDto(
    @Json(name = "raw_text") val rawText: String,
    val items: List<Map<String, Any?>> = emptyList(),
)

data class VisionOcrUploadResponseDto(
    @Json(name = "job_id") val jobId: String,
)

data class VisionActionResponseDto(
    val message: String,
)
