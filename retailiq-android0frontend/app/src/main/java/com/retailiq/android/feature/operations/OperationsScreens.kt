package com.retailiq.android.feature.operations

import android.content.Context
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.AnalyticsSummary
import com.retailiq.android.core.model.AssistantPrompt
import com.retailiq.android.core.model.AssistantResponseSnapshot
import com.retailiq.android.core.model.DashboardSnapshot
import com.retailiq.android.core.model.ModuleStatus
import com.retailiq.android.core.model.ModuleSpec
import com.retailiq.android.core.model.ProductSummary
import com.retailiq.android.core.model.SalesDraft
import com.retailiq.android.core.model.Session
import com.retailiq.android.core.model.VisionOcrJobDto
import com.retailiq.android.core.model.VisionReceiptDto
import com.retailiq.android.core.model.VisionShelfScanDto
import com.retailiq.android.ui.components.AppScreen
import com.retailiq.android.ui.components.InsightCard
import com.retailiq.android.ui.components.PillLabel
import com.retailiq.android.ui.components.RecordRow
import com.retailiq.android.ui.components.StatCard
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

@Composable
fun DashboardScreen(
    repository: RetailIqRepository,
    session: Session?,
) {
    val state = rememberBackendResource(repository) { dashboard() }

    AppScreen(
        title = "Executive Dashboard",
        subtitle = "Store pulse, decision shortcuts, and live operational risk.",
    ) {
        Text(
            text = "Signed in as ${session?.role ?: "owner"} for store ${session?.storeId ?: "demo"}.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.secondary,
        )

        if (state.loading) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else if (state.error != null) {
            Text(
                text = state.error,
                color = MaterialTheme.colorScheme.error,
            )
        } else {
            val ui = state.data ?: return@AppScreen

            Text(ui.greeting, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Text(ui.storeName, style = MaterialTheme.typography.titleMedium)

            ui.kpis.chunked(2).forEach { row ->
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    row.forEach { card ->
                        StatCard(
                            title = card.label,
                            value = card.value,
                            detail = card.trend,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }

            InsightCard(
                title = "Quick actions",
                body = ui.quickActions.joinToString(separator = "\n") { "• ${it.title}: ${it.description}" },
                footnote = "Tap targets can map into module flows next.",
                modifier = Modifier.fillMaxWidth(),
            )

            ui.alerts.forEach { alert ->
                InsightCard(
                    title = alert.title,
                    body = alert.body,
                    footnote = alert.severity,
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Today timeline", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    ui.timeline.forEach { item ->
                        Text(item, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}

@Composable
fun InventoryScreen(repository: RetailIqRepository) {
    val state = rememberBackendResource(repository) { inventory() }
    var query by remember { mutableStateOf("") }

    AppScreen(
        title = "Inventory",
        subtitle = "Shelf-ready stock visibility, reorder cues, and fast product lookup.",
    ) {
        when {
            state.loading -> LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            state.error != null -> Text(text = state.error, color = MaterialTheme.colorScheme.error)
            else -> {
                val products = state.data.orEmpty()
                val filteredProducts = products.filter { product ->
                    query.isBlank() || product.name.contains(query, ignoreCase = true) || product.sku.contains(query, ignoreCase = true)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = query,
                        onValueChange = { query = it },
                        label = { Text("Search SKU or barcode") },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                    )
                    Button(onClick = {}) {
                        Text("New Product")
                    }
                }

                filteredProducts.forEach { product ->
                    Card(
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    ) {
                        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Text(product.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                    Text("${product.sku} • ${product.supplier}", style = MaterialTheme.typography.bodySmall)
                                }
                                PillLabel(text = product.priceLabel)
                            }
                            RecordRow("Current stock", "Available sellable units", product.stock.toString())
                            RecordRow("Reorder level", "Minimum safe threshold", product.reorderLevel.toString())
                            AssistChip(
                                onClick = {},
                                label = { Text(if (product.stock <= product.reorderLevel) "Reorder now" else "Healthy") },
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PosScreen(repository: RetailIqRepository) {
    val state = rememberBackendResource(repository) { salesDraft() }

    AppScreen(
        title = "Point Of Sale",
        subtitle = "Counter workflow optimized for quick checkout, scanning, and assisted selling.",
    ) {
        when {
            state.loading -> LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            state.error != null -> Text(text = state.error, color = MaterialTheme.colorScheme.error)
            else -> {
                val currentDraft = state.data ?: return@AppScreen
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    StatCard("Current basket", currentDraft.totalLabel, currentDraft.orderId, Modifier.weight(1f))
                    StatCard("Payment mode", currentDraft.paymentMode, "Ready to complete", Modifier.weight(1f))
                }

                currentDraft.lines.forEach { line ->
                    Card(shape = RoundedCornerShape(20.dp)) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Column {
                                Text(line.productName, fontWeight = FontWeight.SemiBold)
                                Text("${line.quantity} units")
                            }
                            Text(line.priceLabel)
                        }
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(onClick = {}, modifier = Modifier.weight(1f)) {
                        Text("Scan Item")
                    }
                    OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) {
                        Text("Take Payment")
                    }
                }
            }
        }
    }
}

@Composable
fun AnalyticsScreen(repository: RetailIqRepository) {
    val state = rememberBackendResource(repository) { analytics() }

    AppScreen(
        title = "Analytics",
        subtitle = "Readable business intelligence for owners and floor managers.",
    ) {
        when {
            state.loading -> LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            state.error != null -> Text(text = state.error, color = MaterialTheme.colorScheme.error)
            else -> {
                val summary = state.data ?: return@AppScreen
                Text(summary.headline, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)

                summary.cards.chunked(2).forEach { row ->
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        row.forEach { card ->
                            StatCard(card.label, card.value, card.trend, Modifier.weight(1f))
                        }
                    }
                }

                InsightCard(
                    title = "Highlights",
                    body = summary.highlights.joinToString(separator = "\n") { "• $it" },
                    footnote = "Positive movement",
                    modifier = Modifier.fillMaxWidth(),
                )
                InsightCard(
                    title = "Watchouts",
                    body = summary.watchouts.joinToString(separator = "\n") { "• $it" },
                    footnote = "Requires operator review",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
fun AiAssistantScreen(repository: RetailIqRepository) {
    var prompts by remember { mutableStateOf<List<AssistantPrompt>>(emptyList()) }
    var query by remember { mutableStateOf("Show me the biggest margin risk today.") }
    var response by remember { mutableStateOf<AssistantResponseSnapshot?>(null) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(repository) {
        prompts = repository.assistantPrompts()
    }

    AppScreen(
        title = "AI Assistant",
        subtitle = "Ask for action, not just reports.",
    ) {
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Question") },
        )
        Button(
            onClick = {
                scope.launch {
                    loading = true
                    error = null
                    response = runCatching { repository.assistantResponse(query) }
                        .onFailure { error = it.message ?: "Assistant query failed." }
                        .getOrNull()
                    loading = false
                }
            },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(if (loading) "Running..." else "Run Suggestion")
        }
        if (loading) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        }
        error?.let { message ->
            Text(message, color = MaterialTheme.colorScheme.error)
        }
        response?.let { result ->
            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(result.headline, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
                    Text("Intent: ${result.intent}")
                    Text(result.detail)
                    Text(result.action, color = MaterialTheme.colorScheme.secondary)
                    result.metrics.forEach { metric ->
                        RecordRow(metric.title, metric.supportingText, metric.value)
                    }
                }
            }

            result.recommendations.forEach { recommendation ->
                InsightCard(
                    title = "Recommendation",
                    body = recommendation,
                    footnote = "Live NLP output",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
        prompts.forEach { prompt ->
            AssistChip(
                onClick = { query = prompt.question },
                label = { Text(prompt.title) },
            )
        }
    }
}

@Composable
fun ScannerScreen(repository: RetailIqRepository) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var ocrJob by remember { mutableStateOf<VisionOcrJobDto?>(null) }
    var shelfScan by remember { mutableStateOf<VisionShelfScanDto?>(null) }
    var receipt by remember { mutableStateOf<VisionReceiptDto?>(null) }
    var shelfUrl by remember { mutableStateOf("https://example.com/shelf.jpg") }
    var receiptUrl by remember { mutableStateOf("https://example.com/receipt.jpg") }
    var statusMessage by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }

    val pickInvoice = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        if (uri == null) {
            return@rememberLauncherForActivityResult
        }
        scope.launch {
            loading = true
            statusMessage = null
            val part = uri.toInvoicePart(context)
            if (part == null) {
                statusMessage = "Could not read the selected image."
                loading = false
                return@launch
            }
            ocrJob = runCatching { repository.uploadInvoiceOcr(part) }
                .onFailure { statusMessage = it.message ?: "OCR upload failed." }
                .getOrNull()
            statusMessage = ocrJob?.let { "OCR job ${it.jobId} is ${it.status.lowercase()}." } ?: statusMessage
            loading = false
        }
    }

    AppScreen(
        title = "Scanner",
        subtitle = "Barcode, shelf, and receipt capture lives here.",
    ) {
        if (loading) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        }
        InsightCard(
            title = "Camera-first workflow",
            body = "Use this destination for barcode scan, receipt OCR upload, and shelf image capture. Keep scan actions reachable from inventory and POS with deep links into this screen.",
            footnote = "Vision + inventory + receipts",
            modifier = Modifier.fillMaxWidth(),
        )

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            Button(
                onClick = { pickInvoice.launch("image/*") },
                modifier = Modifier.weight(1f),
            ) {
                Text("Upload OCR")
            }
            OutlinedButton(
                onClick = {
                    scope.launch {
                        loading = true
                        statusMessage = null
                        shelfScan = runCatching { repository.shelfScan(shelfUrl) }
                            .onFailure { statusMessage = it.message ?: "Shelf scan failed." }
                            .getOrNull()
                        loading = false
                    }
                },
                modifier = Modifier.weight(1f),
            ) {
                Text("Shelf Scan")
            }
        }

        OutlinedTextField(
            value = shelfUrl,
            onValueChange = { shelfUrl = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Shelf image URL") },
        )
        OutlinedTextField(
            value = receiptUrl,
            onValueChange = { receiptUrl = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Receipt image URL") },
        )

        Button(
            onClick = {
                scope.launch {
                    loading = true
                    statusMessage = null
                    receipt = runCatching { repository.receiptAnalysis(receiptUrl) }
                        .onFailure { statusMessage = it.message ?: "Receipt digitization failed." }
                        .getOrNull()
                    loading = false
                }
            },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Digitize Receipt")
        }

        statusMessage?.let { message ->
            Text(message, color = MaterialTheme.colorScheme.secondary)
        }

        ocrJob?.let { job ->
            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("OCR Job ${job.jobId}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text("Status: ${job.status}")
                    job.items.forEach { item ->
                        RecordRow(item.productName ?: item.rawText, "Confidence ${item.confidence ?: 0.0}", item.quantity?.toString() ?: "-")
                    }
                }
            }
        }

        shelfScan?.let { scan ->
            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Shelf scan", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text("Status: ${scan.status}")
                    Text("Compliance score: ${scan.complianceScore}")
                    Text(scan.message ?: "Live shelf scan returned.")
                    Text("Detected products: ${scan.detectedProducts.size}")
                    Text("Out of stock slots: ${scan.outOfStockSlots.size}")
                }
            }
        }

        receipt?.let { result ->
            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Receipt digitization", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text(result.rawText)
                    Text("Items: ${result.items.size}")
                }
            }
        }
    }
}

@Composable
fun OperationsHubScreen(
    repository: RetailIqRepository,
    onOpenModule: (String) -> Unit,
) {
    val state = rememberBackendResource(repository) { modules() }

    AppScreen(
        title = "Operations Hub",
        subtitle = "The rest of the backend surface area lives here as focused mobile modules.",
    ) {
        when {
            state.loading -> LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            state.error != null -> Text(text = state.error, color = MaterialTheme.colorScheme.error)
            else -> {
                state.data.orEmpty().forEach { module ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onOpenModule(module.route) },
                        shape = RoundedCornerShape(24.dp),
                    ) {
                        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Text(module.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                    Text(module.subtitle)
                                }
                                PillLabel(
                                    text = when (module.status) {
                                        ModuleStatus.Ready -> "Ready"
                                        ModuleStatus.Planned -> "Planned"
                                    },
                                )
                            }
                            Text(module.heroMetric, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                            Text(module.description)
                            Text(module.backendPrefix, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.secondary)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ModuleDetailScreen(
    repository: RetailIqRepository,
    route: String,
) {
    when (route) {
        "dashboard" -> {
            DashboardScreen(repository, null)
            return
        }
        "inventory" -> {
            InventoryScreen(repository)
            return
        }
        "transactions" -> {
            PosScreen(repository)
            return
        }
        "analytics" -> {
            AnalyticsScreen(repository)
            return
        }
        "store" -> {
            StoreAdminScreen(repository)
            return
        }
        "customers" -> {
            CustomerCenterScreen(repository)
            return
        }
        "suppliers" -> {
            SupplierCenterScreen(repository)
            return
        }
        "forecasting" -> {
            ForecastingSurfaceScreen(repository)
            return
        }
        "receipts" -> {
            ReceiptsSurfaceScreen(repository)
            return
        }
        "developer" -> {
            DeveloperConsoleScreen(repository)
            return
        }
        "system" -> {
            SystemStatusScreen(repository)
            return
        }
    }

    var module by remember { mutableStateOf<ModuleSpec?>(null) }

    LaunchedEffect(repository, route) {
        module = repository.module(route)
    }

    val detail = module

    AppScreen(
        title = detail?.title ?: "Module",
        subtitle = detail?.subtitle ?: "Backend-connected module surface.",
    ) {
        if (detail == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Status", detail.status.name, detail.category.label, Modifier.weight(1f))
                StatCard("Hero metric", detail.heroMetric, detail.backendPrefix, Modifier.weight(1f))
            }

            InsightCard(
                title = "Why this module matters",
                body = detail.description,
                footnote = "Route ${detail.route}",
                modifier = Modifier.fillMaxWidth(),
            )

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Operational view", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    detail.records.forEachIndexed { index, record ->
                        RecordRow(record.title, record.supportingText, record.value)
                        if (index != detail.records.lastIndex) {
                            HorizontalDivider()
                        }
                    }
                }
            }

            detail.actions.forEach { action ->
                InsightCard(
                    title = action.title,
                    body = action.detail,
                    footnote = "Designed mobile action",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

private fun Uri.toInvoicePart(context: Context): MultipartBody.Part? {
    val mimeType = context.contentResolver.getType(this) ?: "image/jpeg"
    val bytes = context.contentResolver.openInputStream(this)?.use { input ->
        input.readBytes()
    } ?: return null

    val requestBody = bytes.toRequestBody(mimeType.toMediaTypeOrNull())
    return MultipartBody.Part.createFormData("invoice_image", "invoice.jpg", requestBody)
}
