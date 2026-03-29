package com.retailiq.android.core.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.automirrored.outlined.Logout
import androidx.compose.material.icons.outlined.Menu
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.navArgument
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.feature.auth.AuthScreen
import com.retailiq.android.feature.operations.AiAssistantScreen
import com.retailiq.android.feature.operations.AnalyticsScreen
import com.retailiq.android.feature.operations.DashboardScreen
import com.retailiq.android.feature.operations.InventoryScreen
import com.retailiq.android.feature.operations.ModuleDetailScreen
import com.retailiq.android.feature.operations.OperationsHubScreen
import com.retailiq.android.feature.operations.PosScreen
import com.retailiq.android.feature.operations.ScannerScreen
import com.retailiq.android.feature.shell.RetailIqAppState
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RetailIqNavHost(
    modifier: Modifier = Modifier,
    repository: RetailIqRepository,
    appState: RetailIqAppState,
    onSignIn: (String, String) -> Unit,
    onSignOut: () -> Unit,
) {
    if (!appState.isAuthenticated) {
        AuthScreen(
            modifier = modifier,
            repository = repository,
            isLoading = appState.isLoading,
            errorMessage = appState.authError,
            onSignIn = onSignIn,
        )
        return
    }

    val navController = rememberNavController()
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val currentBackStack by navController.currentBackStackEntryAsState()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                Text(
                    text = "RetailIQ Modules",
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 20.dp),
                )
                listOf(
                    AppDestination(RetailIqDestinations.operations, "Operations Hub", Icons.Outlined.Menu),
                    AppDestination(RetailIqDestinations.scanner, "Scanner", Icons.Outlined.Inventory2),
                ).forEach { destination ->
                    NavigationDrawerItem(
                        label = { Text(destination.title) },
                        selected = currentBackStack?.destination?.route == destination.route,
                        onClick = {
                            scope.launch { drawerState.close() }
                            navController.navigate(destination.route)
                        },
                    )
                }
            }
        },
    ) {
        Scaffold(
            modifier = modifier,
            topBar = {
                TopAppBar(
                    title = { Text("RetailIQ Android") },
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Outlined.Menu, contentDescription = "Open modules")
                        }
                    },
                    actions = {
                        IconButton(onClick = onSignOut) {
                            Icon(Icons.AutoMirrored.Outlined.Logout, contentDescription = "Sign out")
                        }
                    },
                )
            },
            bottomBar = {
                NavigationBar {
                    RetailIqDestinations.topLevel.forEach { destination ->
                        val selected = currentBackStack?.destination?.hierarchy?.any { it.route == destination.route } == true
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(destination.route) {
                                    popUpTo(navController.graph.startDestinationId) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(destination.icon, contentDescription = destination.title) },
                            label = { Text(destination.title) },
                        )
                    }
                }
            },
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = RetailIqDestinations.topLevel.first().route,
                modifier = Modifier.padding(innerPadding),
            ) {
                composable(RetailIqDestinations.topLevel[0].route) {
                    DashboardScreen(repository = repository, session = appState.session)
                }
                composable(RetailIqDestinations.topLevel[1].route) {
                    InventoryScreen(repository = repository)
                }
                composable(RetailIqDestinations.topLevel[2].route) {
                    PosScreen(repository = repository)
                }
                composable(RetailIqDestinations.topLevel[3].route) {
                    AnalyticsScreen(repository = repository)
                }
                composable(RetailIqDestinations.topLevel[4].route) {
                    AiAssistantScreen(repository = repository)
                }
                composable(RetailIqDestinations.scanner) {
                    ScannerScreen(repository = repository)
                }
                composable(RetailIqDestinations.operations) {
                    OperationsHubScreen(
                        repository = repository,
                        onOpenModule = { route ->
                            navController.navigate("${RetailIqDestinations.moduleDetail}/$route")
                        },
                    )
                }
                composable(
                    route = "${RetailIqDestinations.moduleDetail}/{route}",
                    arguments = listOf(navArgument("route") { defaultValue = "customers" }),
                ) { backStackEntry ->
                    ModuleDetailScreen(
                        repository = repository,
                        route = backStackEntry.arguments?.getString("route") ?: "customers",
                    )
                }
            }
        }
    }
}


