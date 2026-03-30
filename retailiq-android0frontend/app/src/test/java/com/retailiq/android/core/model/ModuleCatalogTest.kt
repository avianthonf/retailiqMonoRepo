package com.retailiq.android.core.model

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ModuleCatalogTest {
    @Test
    fun moduleCatalogIncludesCoreBackendSections() {
        val routes = RetailIqModuleCatalog.defaultModules().map { it.route }.toSet()

        assertTrue("dashboard" in routes)
        assertTrue("inventory" in routes)
        assertTrue("transactions" in routes)
        assertTrue("analytics" in routes)
        assertTrue("barcodes" in routes)
        assertTrue("store" in routes)
        assertTrue("customers" in routes)
        assertTrue("suppliers" in routes)
        assertTrue("forecasting" in routes)
        assertTrue("gst" in routes)
        assertTrue("loyalty" in routes)
        assertTrue("credit" in routes)
        assertTrue("i18n" in routes)
        assertTrue("market" in routes)
        assertTrue("receipts" in routes)
        assertTrue("vision" in routes)
        assertTrue("ops" in routes)
        assertTrue("tax" in routes)
        assertTrue("finance" in routes)
        assertTrue("ai" in routes)
        assertTrue("developer" in routes)
        assertTrue("staff" in routes)
        assertTrue("system" in routes)
        assertTrue("offline" in routes)
        assertTrue("kyc" in routes)
        assertTrue("whatsapp" in routes)
        assertTrue("events" in routes)
        assertTrue("marketplace" in routes)
        assertTrue("chain" in routes)
        assertTrue("pricing" in routes)
        assertTrue("decisions" in routes)
        assertTrue("einvoicing" in routes)
    }

    @Test
    fun authPanelsCoverCoreEntryFlows() {
        val panelModes = RetailIqModuleCatalog.authPanels().map { it.mode }

        assertEquals(4, panelModes.size)
        assertTrue(AuthMode.SignIn in panelModes)
        assertTrue(AuthMode.Register in panelModes)
        assertTrue(AuthMode.VerifyOtp in panelModes)
        assertTrue(AuthMode.ResetPassword in panelModes)
    }

    @Test
    fun moduleLookupReturnsSpecializedRoutes() {
        assertEquals("Dashboard", RetailIqModuleCatalog.module("dashboard").title)
        assertEquals("Inventory", RetailIqModuleCatalog.module("inventory").title)
        assertEquals("Transactions", RetailIqModuleCatalog.module("transactions").title)
        assertEquals("Analytics", RetailIqModuleCatalog.module("analytics").title)
        assertEquals("Barcodes", RetailIqModuleCatalog.module("barcodes").title)
        assertEquals("Store Admin", RetailIqModuleCatalog.module("store").title)
        assertEquals("I18N", RetailIqModuleCatalog.module("i18n").title)
        assertEquals("Market Intelligence", RetailIqModuleCatalog.module("market").title)
        assertEquals("Operations", RetailIqModuleCatalog.module("ops").title)
        assertEquals("Tax Engine", RetailIqModuleCatalog.module("tax").title)
        assertEquals("Finance", RetailIqModuleCatalog.module("finance").title)
        assertEquals("AI V2", RetailIqModuleCatalog.module("ai").title)
        assertEquals("System Status", RetailIqModuleCatalog.module("system").title)
        assertEquals("Pricing", RetailIqModuleCatalog.module("pricing").title)
        assertEquals("E-Invoicing", RetailIqModuleCatalog.module("einvoicing").title)
        assertEquals("Offline Sync", RetailIqModuleCatalog.module("offline").title)
    }

    @Test
    fun longTailRoutesAreMarkedReady() {
        val routes = RetailIqModuleCatalog.defaultModules()
            .filter { it.route in setOf("ops", "marketplace", "chain", "pricing", "decisions", "einvoicing", "staff", "offline") }

        assertTrue(routes.isNotEmpty())
        assertTrue(routes.all { it.status == ModuleStatus.Ready })
    }

    @Test
    fun contractPrefixesMatchBackendHealthAndOpsRoutes() {
        assertEquals("/api/v1/dashboard/overview", RetailIqModuleCatalog.module("dashboard").backendPrefix)
        assertEquals("/api/v1/inventory", RetailIqModuleCatalog.module("inventory").backendPrefix)
        assertEquals("/api/v1/transactions/summary/daily", RetailIqModuleCatalog.module("transactions").backendPrefix)
        assertEquals("/api/v1/analytics/dashboard", RetailIqModuleCatalog.module("analytics").backendPrefix)
        assertEquals("/api/v1/barcodes", RetailIqModuleCatalog.module("barcodes").backendPrefix)
        assertEquals("/api/v1/i18n", RetailIqModuleCatalog.module("i18n").backendPrefix)
        assertEquals("/api/v1/market", RetailIqModuleCatalog.module("market").backendPrefix)
        assertEquals("/api/v1/developer/apps", RetailIqModuleCatalog.module("developer").backendPrefix)
        assertEquals("/api/v1/ops", RetailIqModuleCatalog.module("ops").backendPrefix)
        assertEquals("/api/v1/tax", RetailIqModuleCatalog.module("tax").backendPrefix)
        assertEquals("/api/v2/finance", RetailIqModuleCatalog.module("finance").backendPrefix)
        assertEquals("/api/v2/ai", RetailIqModuleCatalog.module("ai").backendPrefix)
        assertEquals("/api/v1/staff", RetailIqModuleCatalog.module("staff").backendPrefix)
        assertEquals("/health", RetailIqModuleCatalog.module("system").backendPrefix)
    }
}
