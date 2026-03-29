package com.retailiq.android.feature.operations

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
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
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.CustomerCenterSnapshot
import com.retailiq.android.core.model.CustomerDirectorySnapshot
import com.retailiq.android.core.model.DeveloperConsoleSnapshot
import com.retailiq.android.core.model.DeveloperLogEntry
import com.retailiq.android.core.model.DeveloperMarketplaceSnapshot
import com.retailiq.android.core.model.DeveloperRateLimitSnapshot
import com.retailiq.android.core.model.DeveloperUsageMetric
import com.retailiq.android.core.model.ForecastHistoricalPoint
import com.retailiq.android.core.model.ForecastingSnapshot
import com.retailiq.android.core.model.HealthSignal
import com.retailiq.android.core.model.PrintJobSummary
import com.retailiq.android.core.model.ReceiptsSnapshot
import com.retailiq.android.core.model.StoreAdminSnapshot
import com.retailiq.android.core.model.SupplierCenterSnapshot
import com.retailiq.android.core.model.SystemStatusSnapshot
import com.retailiq.android.ui.components.AppScreen
import com.retailiq.android.ui.components.InsightCard
import com.retailiq.android.ui.components.PillLabel
import com.retailiq.android.ui.components.RecordRow
import com.retailiq.android.ui.components.SectionHeader
import com.retailiq.android.ui.components.StatCard
import kotlinx.coroutines.launch

@Composable
fun StoreAdminScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<StoreAdminSnapshot?>(null) }

    LaunchedEffect(repository) {
        snapshot = repository.storeSnapshot()
    }

    AppScreen(
        title = "Store Admin",
        subtitle = "Profile, category, and tax controls for the current store.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            SectionHeader(
                title = data.profile.storeName,
                subtitle = data.profile.businessHours,
            )

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Store type", data.profile.storeType, data.profile.currency, Modifier.weight(1f))
                StatCard("GST", data.profile.gstNumber, data.profile.address, Modifier.weight(1f))
            }

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Profile", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    RecordRow("Phone", "Store contact number", data.profile.phone)
                    RecordRow("Address", "Store location", data.profile.address)
                    RecordRow("Business hours", "Core operating window", data.profile.businessHours)
                }
            }

            InsightCard(
                title = "Tax config",
                body = data.taxConfig.taxes.joinToString(separator = "\n") { tax ->
                    "${tax.name} - ${tax.gstRate}% GST"
                },
                footnote = "Bulk update is owner-only.",
                modifier = Modifier.fillMaxWidth(),
            )

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Categories", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    data.categories.forEach { category ->
                        RecordRow(category.name, if (category.active) "Active category" else "Archived category", "${category.gstRate}%")
                    }
                }
            }

            data.notes.forEach { note ->
                InsightCard(
                    title = "Store note",
                    body = note,
                    footnote = "Store management guidance",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
fun CustomerCenterScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<CustomerCenterSnapshot?>(null) }
    var query by remember { mutableStateOf("") }

    LaunchedEffect(repository) {
        snapshot = repository.customerSnapshot()
    }

    AppScreen(
        title = "Customer Center",
        subtitle = "Retention, segmentation, and high-value relationship actions.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                label = { Text("Search customers") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
            )

            data.metrics.chunked(2).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    row.forEach { metric ->
                        StatCard(metric.label, metric.value, metric.trend, Modifier.weight(1f))
                    }
                }
            }

            InsightCard(
                title = "Customer headline",
                body = data.headline,
                footnote = "Top customers and retention signals",
                modifier = Modifier.fillMaxWidth(),
            )

            data.topCustomers
                .filter { query.isBlank() || it.name.contains(query, ignoreCase = true) || it.mobileNumber.contains(query) }
                .forEach { customer ->
                    Card(shape = RoundedCornerShape(24.dp)) {
                        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Text(customer.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                    Text(customer.mobileNumber, style = MaterialTheme.typography.bodySmall)
                                }
                                PillLabel(text = customer.valueLabel)
                            }
                            Text(customer.note, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }

            SectionHeader(title = "Customer directory", subtitle = "Live records from the backend")
            data.directory
                .filter { query.isBlank() || it.name.contains(query, ignoreCase = true) || it.mobileNumber.contains(query) }
                .forEach { customer ->
                    Card(shape = RoundedCornerShape(24.dp)) {
                        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(customer.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            RecordRow("Mobile", "Primary contact", customer.mobileNumber)
                            RecordRow("Email", "If available", customer.email ?: "Not set")
                            Text("Created ${customer.createdAt ?: "unknown"}", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }

            data.insights.forEach { insight ->
                InsightCard(
                    title = "Customer insight",
                    body = insight,
                    footnote = "Use this for campaigns, credits, or save actions.",
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                data.actions.forEachIndexed { index, action ->
                    if (index == 0) {
                        Button(onClick = {}, modifier = Modifier.weight(1f)) { Text(action) }
                    } else {
                        OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) { Text(action) }
                    }
                }
            }
        }
    }
}

@Composable
fun SupplierCenterScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<SupplierCenterSnapshot?>(null) }

    LaunchedEffect(repository) {
        snapshot = repository.supplierSnapshot()
    }

    AppScreen(
        title = "Supplier Center",
        subtitle = "Vendor reliability, open orders, and sourcing context.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Active suppliers", data.suppliers.size.toString(), "Current vendor roster", Modifier.weight(1f))
                StatCard("Open issues", data.riskNotes.size.toString(), "Watchlist notes", Modifier.weight(1f))
            }

            InsightCard(
                title = "Supplier headline",
                body = data.headline,
                footnote = "Use this to prioritize purchase order follow-up.",
                modifier = Modifier.fillMaxWidth(),
            )

            data.suppliers.forEach { supplier ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(supplier.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                Text("${supplier.contact} - ${supplier.phone}", style = MaterialTheme.typography.bodySmall)
                            }
                            PillLabel(text = supplier.reliability)
                        }
                        RecordRow("Open POs", "Awaiting shipment confirmation", supplier.openPurchaseOrders.toString())
                        RecordRow("Lead time", "Typical replenishment lag", "${supplier.leadTimeDays} days")
                        RecordRow("Category focus", "Primary assortment", supplier.categoryFocus)
                    }
                }
            }

            data.riskNotes.forEach { note ->
                InsightCard(
                    title = "Supplier risk",
                    body = note,
                    footnote = "Procurement review",
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                data.actions.forEachIndexed { index, action ->
                    if (index == 0) {
                        Button(onClick = {}, modifier = Modifier.weight(1f)) { Text(action) }
                    } else {
                        OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) { Text(action) }
                    }
                }
            }
        }
    }
}

@Composable
fun ForecastingSurfaceScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<ForecastingSnapshot?>(null) }

    LaunchedEffect(repository) {
        snapshot = repository.forecastingSnapshot()
    }

    AppScreen(
        title = "Forecasting",
        subtitle = "Store-level and SKU-level demand predictions with reorder guidance.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            InsightCard(
                title = data.headline,
                body = "${data.storeLabel}\n${data.skuLabel}",
                footnote = "Cached forecast outputs from the backend model pipeline.",
                modifier = Modifier.fillMaxWidth(),
            )

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Historical demand", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    data.historical.forEach { point ->
                        RecordRow(point.date, "Actual units", point.actual.toString())
                    }
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Reorder", if (data.suggestion.shouldReorder) "Yes" else "No", "Suggested qty ${data.suggestion.suggestedOrderQty}", Modifier.weight(1f))
                StatCard("Demand", data.suggestion.forecastedDemand.toString(), "Lead time ${data.suggestion.leadTimeDays} days", Modifier.weight(1f))
            }

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Store forecast", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    data.storeForecast.forEach { point ->
                        RecordRow(point.date, "Mean ${point.forecastMean}", "Range ${point.lowerBound} - ${point.upperBound}")
                    }
                }
            }

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("SKU forecast", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    data.skuForecast.forEach { point ->
                        RecordRow(point.date, "Mean ${point.forecastMean}", "Range ${point.lowerBound} - ${point.upperBound}")
                    }
                }
            }

            data.signals.forEach { signal ->
                InsightCard(
                    title = "Forecast signal",
                    body = signal,
                    footnote = "Demand planning note",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
fun ReceiptsSurfaceScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<ReceiptsSnapshot?>(null) }
    var latestJob by remember { mutableStateOf<PrintJobSummary?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(repository) {
        snapshot = repository.receiptsSnapshot()
    }

    AppScreen(
        title = "Receipts",
        subtitle = "Template control, print queue visibility, and reprint recovery.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Template", data.template.templateName, data.template.status, Modifier.weight(1f))
                StatCard("Paper width", "${data.template.paperWidthMm}mm", data.template.logoMode, Modifier.weight(1f))
            }

            Card(shape = RoundedCornerShape(24.dp)) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Template details", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    RecordRow("Footer", "Receipt footer content", data.template.footerText)
                    RecordRow("Tax visibility", "Tax presentation mode", data.template.taxVisibility)
                    RecordRow("Logo mode", "Brand treatment", data.template.logoMode)
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                Button(
                    onClick = {
                        scope.launch {
                            latestJob = repository.createReceiptPrintJob()
                        }
                    },
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Create print job")
                }
                OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) {
                    Text("Refresh template")
                }
            }

            latestJob?.let { job ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Latest live job", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                        RecordRow("Job", "Backend job reference", job.jobId)
                        RecordRow("Status", "Current processing state", job.status)
                        RecordRow("Created", "Created timestamp", job.createdAt)
                        Text(job.trigger, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }

            data.jobs.forEach { job ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(job.jobId, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                Text("${job.destination} - ${job.createdAt}", style = MaterialTheme.typography.bodySmall)
                            }
                            PillLabel(text = job.status)
                        }
                        Text(job.trigger)
                    }
                }
            }

            data.notes.forEach { note ->
                InsightCard(
                    title = "Receipt note",
                    body = note,
                    footnote = "Receipt workflow guidance",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
fun DeveloperConsoleScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<DeveloperConsoleSnapshot?>(null) }

    LaunchedEffect(repository) {
        snapshot = repository.developerSnapshot()
    }

    AppScreen(
        title = "Developer Console",
        subtitle = "Apps, usage, rate limits, logs, and webhook readiness.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            InsightCard(
                title = "Registration",
                body = data.registrationHint,
                footnote = "Developer platform entry point",
                modifier = Modifier.fillMaxWidth(),
            )

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Apps", data.apps.size.toString(), "Registered integrations", Modifier.weight(1f))
                StatCard("Logs", data.logs.size.toString(), "Recent integration events", Modifier.weight(1f))
            }

            data.apps.forEach { app ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(app.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                Text(app.appRef, style = MaterialTheme.typography.bodySmall)
                            }
                            PillLabel(text = app.status)
                        }
                        RecordRow("Webhook", "Delivery readiness", if (app.webhookEnabled) "Enabled" else "Disabled")
                        RecordRow("Rate limit", "Current request budget", app.requestsToday)
                        RecordRow("Secret rotated", "Credential freshness", app.secretRotated)
                    }
                }
            }

            SectionHeader(title = "Usage", subtitle = "Developer traffic and quotas")
            data.usage.forEach { usage ->
                InsightCard(
                    title = usage.title,
                    body = "${usage.value}\n${usage.detail}",
                    footnote = "Developer metric",
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            SectionHeader(title = "Rate limits", subtitle = "Budget health per application")
            data.rateLimits.forEach { limit ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        RecordRow(limit.appName, "Remaining request budget", limit.budget)
                        Text(limit.resetLabel, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }

            SectionHeader(title = "Marketplace", subtitle = "Approved integrations ready for review")
            data.marketplace.forEach { item ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(item.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                                Text(item.category)
                            }
                            PillLabel(text = item.status)
                        }
                    }
                }
            }

            SectionHeader(title = "Logs", subtitle = "Recent API and webhook delivery messages")
            data.logs.forEachIndexed { index, log ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("${log.level} - ${log.timestamp}", style = MaterialTheme.typography.bodySmall)
                        Text(log.summary)
                    }
                }
                if (index != data.logs.lastIndex) {
                    HorizontalDivider()
                }
            }

            data.notes.forEach { note ->
                InsightCard(
                    title = "Developer note",
                    body = note,
                    footnote = "Integration guidance",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
fun SystemStatusScreen(repository: RetailIqRepository) {
    var snapshot by remember { mutableStateOf<SystemStatusSnapshot?>(null) }

    LaunchedEffect(repository) {
        snapshot = repository.systemStatus()
    }

    AppScreen(
        title = "System Status",
        subtitle = "Health checks and team ping for the mobile operator shell.",
    ) {
        val data = snapshot
        if (data == null) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard("Team ping", data.teamPing, "No auth required", Modifier.weight(1f))
                StatCard("Services", data.health.size.toString(), "Checked services", Modifier.weight(1f))
            }

            data.health.forEach { signal ->
                Card(shape = RoundedCornerShape(24.dp)) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(signal.service, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            PillLabel(text = signal.status)
                        }
                        Text(signal.detail)
                    }
                }
            }

            data.notes.forEach { note ->
                InsightCard(
                    title = "System note",
                    body = note,
                    footnote = "Operational guidance",
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}
