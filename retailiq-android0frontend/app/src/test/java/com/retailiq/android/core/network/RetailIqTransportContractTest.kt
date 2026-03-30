package com.retailiq.android.core.network

import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.RetailIqModuleCatalog
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.nio.file.Files
import java.nio.file.Paths
import kotlin.text.Charsets.UTF_8

class RetailIqTransportContractTest {
    @Test
    fun systemHealthTargetsBackendRootHealthRoute() {
        assertEquals("/health", HEALTH_PATH)
        assertEquals("/api/v1/team/ping", TEAM_PING_PATH)
    }

    @Test
    fun opsMaintenanceTargetsBackendMaintenanceRoute() {
        assertEquals("/api/v1/ops/maintenance", OPS_MAINTENANCE_PATH)
    }

    @Test
    fun debugBlankBackendUrlFallsBackToEmulatorHost() {
        assertEquals(
            "http://10.0.2.2:5000",
            RetailIqRepository.resolveBackendBaseUrl("", isDebug = true, useEmulatorHost = true),
        )
    }

    @Test
    fun debugBlankBackendUrlFallsBackToLoopbackOnPhysicalDevices() {
        assertEquals(
            "http://127.0.0.1:5000",
            RetailIqRepository.resolveBackendBaseUrl("", isDebug = true, useEmulatorHost = false),
        )
    }

    @Test
    fun releaseBlankBackendUrlFailsFast() {
        val error = try {
            RetailIqRepository.resolveBackendBaseUrl("", isDebug = false)
            null
        } catch (throwable: IllegalStateException) {
            throwable
        }

        assertTrue(error != null)
        assertTrue(error?.message?.contains("RETAILIQ_BASE_URL") == true)
    }

    @Test
    fun emulatorDetectionRecognizesCommonEmulatorFingerprints() {
        assertTrue(
            RetailIqRepository.isProbablyEmulator(
                fingerprint = "generic/sdk_gphone64_arm64/emulator",
                model = "sdk_gphone64_arm64",
                manufacturer = "Google",
                brand = "generic",
                device = "generic_x86_64",
                product = "sdk_gphone64_arm64",
            ),
        )
    }

    @Test
    fun emulatorDetectionRejectsTypicalPhysicalDeviceFingerprints() {
        assertTrue(
            !RetailIqRepository.isProbablyEmulator(
                fingerprint = "google/panther/panther:15/AP4A.250205.002/1234567:user/release-keys",
                model = "Pixel 8",
                manufacturer = "Google",
                brand = "google",
                device = "panther",
                product = "panther",
            ),
        )
    }

    @Test
    fun debugNetworkSecurityConfigPermitsCleartextForConfiguredDevHosts() {
        val configPath = Paths.get("src", "debug", "res", "xml", "network_security_config.xml")
        val config = String(Files.readAllBytes(configPath), UTF_8)

        assertTrue(config.contains("<base-config cleartextTrafficPermitted=\"true\""))
    }

    @Test
    fun androidSurfaceInventoryTracksBackendPrefixes() {
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
