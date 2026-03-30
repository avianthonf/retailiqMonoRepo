package com.retailiq.android.feature.operations

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.retailiq.android.core.data.RetailIqRepository

data class BackendResourceState<T>(
    val data: T? = null,
    val loading: Boolean = true,
    val error: String? = null,
)

@Composable
fun <T> rememberBackendResource(
    repository: RetailIqRepository,
    vararg keys: Any?,
    loader: suspend RetailIqRepository.() -> T,
): BackendResourceState<T> {
    var data by remember(repository, *keys) { mutableStateOf<T?>(null) }
    var loading by remember(repository, *keys) { mutableStateOf(true) }
    var error by remember(repository, *keys) { mutableStateOf<String?>(null) }

    LaunchedEffect(repository, *keys) {
        loading = true
        error = null
        data = runCatching { repository.loader() }
            .onFailure { error = it.message ?: "Backend request failed." }
            .getOrNull()
        loading = false
    }

    return BackendResourceState(
        data = data,
        loading = loading,
        error = error,
    )
}
