package com.retailiq.android.core.model

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ModuleCatalogTest {
    @Test
    fun moduleCatalogIncludesCoreBackendSections() {
        val routes = RetailIqModuleCatalog.defaultModules().map { it.route }.toSet()

        assertTrue("store" in routes)
        assertTrue("customers" in routes)
        assertTrue("suppliers" in routes)
        assertTrue("forecasting" in routes)
        assertTrue("gst" in routes)
        assertTrue("loyalty" in routes)
        assertTrue("credit" in routes)
        assertTrue("receipts" in routes)
        assertTrue("vision" in routes)
        assertTrue("developer" in routes)
        assertTrue("system" in routes)
        assertTrue("offline" in routes)
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
        assertEquals("Store Admin", RetailIqModuleCatalog.module("store").title)
        assertEquals("System Status", RetailIqModuleCatalog.module("system").title)
        assertEquals("Pricing", RetailIqModuleCatalog.module("pricing").title)
        assertEquals("E-Invoicing", RetailIqModuleCatalog.module("einvoicing").title)
        assertEquals("Offline Sync", RetailIqModuleCatalog.module("offline").title)
    }

    @Test
    fun longTailRoutesAreMarkedReady() {
        val routes = RetailIqModuleCatalog.defaultModules()
            .filter { it.route in setOf("marketplace", "chain", "pricing", "decisions", "einvoicing", "staff", "offline") }

        assertTrue(routes.isNotEmpty())
        assertTrue(routes.all { it.status == ModuleStatus.Ready })
    }
}
