package com.retailiq.android.feature.shell

import com.retailiq.android.core.data.RetailIqRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class RetailIqAppViewModelTest {
    @Test
    fun restoresPersistedSessionOnInit() = runTest {
        val repository = RetailIqRepository.create()
        repository.signIn("9876543210", "demo")

        val viewModel = RetailIqAppViewModel(repository)

        assertTrue(viewModel.uiState.value.isAuthenticated)
        assertTrue(viewModel.uiState.value.session != null)
    }

    @Test
    fun signInRestoresAuthenticatedStateAndSignOutClearsIt() = runTest {
        val repository = RetailIqRepository.create()
        val viewModel = RetailIqAppViewModel(repository)

        assertFalse(viewModel.uiState.value.isAuthenticated)

        viewModel.signIn("9876543210", "demo")
        advanceUntilIdle()

        assertTrue(viewModel.uiState.value.isAuthenticated)
        assertTrue(repository.currentSession() != null)

        viewModel.signOut()

        assertFalse(viewModel.uiState.value.isAuthenticated)
        assertTrue(repository.currentSession() == null)
    }
}
