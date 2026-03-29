package com.retailiq.android.core.navigation

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class AppDestinationTest {
    @Test
    fun topLevelDestinationsStayStable() {
        assertEquals(5, RetailIqDestinations.topLevel.size)
        assertEquals(
            listOf("dashboard", "inventory", "pos", "analytics", "assistant"),
            RetailIqDestinations.topLevel.map { it.route },
        )
    }

    @Test
    fun topLevelRoutesRemainUnique() {
        val routes = RetailIqDestinations.topLevel.map { it.route }
        assertEquals(routes.distinct().size, routes.size)
        assertTrue(routes.all { it.isNotBlank() })
    }

    @Test
    fun moduleDetailRouteRemainsAvailable() {
        assertEquals("module", RetailIqDestinations.moduleDetail)
    }
}
