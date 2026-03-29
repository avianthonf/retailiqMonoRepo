package com.retailiq.android.feature.shell

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.Session
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
) : ViewModel() {
    private val _uiState = MutableStateFlow(RetailIqAppState())
    val uiState: StateFlow<RetailIqAppState> = _uiState.asStateFlow()

    init {
        repository.currentSession()?.let { session ->
            _uiState.value = RetailIqAppState(
                isAuthenticated = true,
                isLoading = false,
                session = session,
            )
        }
    }

    fun signIn(mobileNumber: String, password: String) {
        _uiState.value = _uiState.value.copy(isLoading = true, authError = null)

        viewModelScope.launch {
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
        repository.signOut()
        _uiState.value = RetailIqAppState()
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
