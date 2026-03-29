package com.retailiq.android.core.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AutoGraph
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.outlined.PointOfSale
import androidx.compose.material.icons.outlined.Psychology
import androidx.compose.ui.graphics.vector.ImageVector

data class AppDestination(
    val route: String,
    val title: String,
    val icon: ImageVector,
)

object RetailIqDestinations {
    val topLevel = listOf(
        AppDestination("dashboard", "Dashboard", Icons.Outlined.Dashboard),
        AppDestination("inventory", "Inventory", Icons.Outlined.Inventory2),
        AppDestination("pos", "POS", Icons.Outlined.PointOfSale),
        AppDestination("analytics", "Analytics", Icons.Outlined.AutoGraph),
        AppDestination("assistant", "AI", Icons.Outlined.Psychology),
    )

    const val auth = "auth"
    const val scanner = "scanner"
    const val operations = "operations"
    const val moduleDetail = "module"
}
