package com.retailiq.android

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.navigation.RetailIqNavHost
import com.retailiq.android.feature.shell.RetailIqAppViewModel
import com.retailiq.android.feature.shell.RetailIqAppViewModelFactory

@Composable
fun RetailIqApp(modifier: Modifier = Modifier) {
    val context = LocalContext.current.applicationContext
    val repository = remember(context) { RetailIqRepository.create(context) }
    val appViewModel: RetailIqAppViewModel = viewModel(factory = RetailIqAppViewModelFactory(repository))
    val appState by appViewModel.uiState.collectAsStateWithLifecycle()

    RetailIqNavHost(
        modifier = modifier,
        repository = repository,
        appState = appState,
        onSignIn = appViewModel::signIn,
        onSignOut = appViewModel::signOut,
    )
}
