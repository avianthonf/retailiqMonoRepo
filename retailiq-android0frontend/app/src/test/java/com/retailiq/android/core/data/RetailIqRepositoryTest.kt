package com.retailiq.android.core.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlinx.coroutines.runBlocking
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MediaType.Companion.toMediaTypeOrNull

class RetailIqRepositoryTest {
    @Test
    fun seededBackendSurfacesStayAvailableWithoutBaseUrl() = runBlocking {
        val repository = RetailIqRepository.create()

        val store = repository.storeSnapshot()
        val customers = repository.customerSnapshot()
        val forecasting = repository.forecastingSnapshot()
        val receipts = repository.receiptsSnapshot()
        val printJob = repository.createReceiptPrintJob()
        val developer = repository.developerSnapshot()
        val ops = repository.module("ops")
        val system = repository.systemStatus()

        assertEquals("RetailIQ Flagship", store.profile.storeName)
        assertEquals(4, store.categories.size)
        assertTrue(customers.topCustomers.isNotEmpty())
        assertTrue(customers.directory.isNotEmpty())
        assertTrue(forecasting.storeForecast.isNotEmpty())
        assertTrue(forecasting.historical.isNotEmpty())
        assertTrue(receipts.template.templateName.isNotBlank())
        assertTrue(printJob.jobId.isNotBlank())
        assertEquals(2, developer.apps.size)
        assertEquals("Operations", ops.title)
        assertEquals("/api/v1/ops", ops.backendPrefix)
        assertEquals("success", system.teamPing)
        assertEquals(2, system.health.size)
        assertTrue(system.health.any { it.service == "API" })
        assertTrue(system.health.any { it.service == "Team Ping" })
        assertTrue(system.health.none { it.service == "Database" || it.service == "Redis" })
    }

    @Test
    fun signInPersistsSessionInMemoryWithoutBaseUrl() = runBlocking {
        val repository = RetailIqRepository.create()

        val session = repository.signIn("9876543210", "demo")

        assertEquals(session, repository.currentSession())
    }

    @Test
    fun assistantAndScannerFallbacksStayAvailableWithoutBaseUrl() = runBlocking {
        val repository = RetailIqRepository.create()

        val assistant = repository.assistantResponse("Show me the biggest margin risk today.")
        val invoicePart = MultipartBody.Part.createFormData(
            "invoice_image",
            "invoice.jpg",
            "demo".toRequestBody("image/jpeg".toMediaTypeOrNull()),
        )
        val ocrJob = repository.uploadInvoiceOcr(invoicePart)
        val shelf = repository.shelfScan("https://example.com/shelf.jpg")
        val receipt = repository.receiptAnalysis("https://example.com/receipt.jpg")

        assertTrue(assistant.headline.isNotBlank())
        assertTrue(assistant.recommendations.isNotEmpty())
        assertTrue(ocrJob.jobId.isNotBlank())
        assertTrue(shelf.status.isNotBlank())
        assertTrue(receipt.rawText.isNotBlank())
    }
}
