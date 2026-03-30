package com.retailiq.android.feature.shell

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.Session
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class RetailIqAppState(
    val isAuthenticated: Boolean = false,
    val isLoading: Boolean = false,
    val session: Session? = null,
    val authError: String? = null,
)

class RetailIqAppViewModel(
    private val repository: RetailIqRepository,
    private val backgroundDispatcher: CoroutineDispatcher = Dispatchers.IO,
) : ViewModel() {
    private val _uiState = MutableStateFlow(RetailIqAppState(isLoading = true))
    val uiState: StateFlow<RetailIqAppState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch(backgroundDispatcher) {
            val session = repository.currentSession()
            _uiState.value = if (session != null) {
                RetailIqAppState(
                    isAuthenticated = true,
                    isLoading = false,
                    session = session,
                )
            } else {
                RetailIqAppState()
            }
        }
    }

    fun signIn(mobileNumber: String, password: String) {
        _uiState.value = _uiState.value.copy(isLoading = true, authError = null)

        viewModelScope.launch(backgroundDispatcher) {
            runCatching { repository.signIn(mobileNumber = mobileNumber, password = password) }
                .onSuccess { session ->
                    _uiState.value = RetailIqAppState(
                        isAuthenticated = true,
                        isLoading = false,
                        session = session,
                    )
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        authError = error.message ?: "Unable to sign in.",
                    )
                }
        }
    }

    fun signOut() {
        viewModelScope.launch(backgroundDispatcher) {
            repository.signOut()
            _uiState.value = RetailIqAppState()
        }
    }
}

class RetailIqAppViewModelFactory(
    private val repository: RetailIqRepository,
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return RetailIqAppViewModel(repository) as T
    }
}
