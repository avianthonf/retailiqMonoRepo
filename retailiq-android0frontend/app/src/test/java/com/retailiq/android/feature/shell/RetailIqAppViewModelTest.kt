package com.retailiq.android.feature.shell

import com.retailiq.android.core.data.RetailIqRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.TestDispatcher
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TestWatcher
import org.junit.runner.Description
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain

@OptIn(ExperimentalCoroutinesApi::class)
class MainDispatcherRule(
    val dispatcher: TestDispatcher = StandardTestDispatcher(),
) : TestWatcher() {
    override fun starting(description: Description) {
        Dispatchers.setMain(dispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}

@OptIn(ExperimentalCoroutinesApi::class)
class RetailIqAppViewModelTest {
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    @Test
    fun restoresPersistedSessionOnInit() = runTest {
        val repository = RetailIqRepository.create()
        repository.signIn("9876543210", "demo")

        val viewModel = RetailIqAppViewModel(repository, mainDispatcherRule.dispatcher)
        advanceUntilIdle()

        assertTrue(viewModel.uiState.value.isAuthenticated)
        assertTrue(viewModel.uiState.value.session != null)
    }

    @Test
    fun signInRestoresAuthenticatedStateAndSignOutClearsIt() = runTest {
        val repository = RetailIqRepository.create()
        val viewModel = RetailIqAppViewModel(repository, mainDispatcherRule.dispatcher)

        assertFalse(viewModel.uiState.value.isAuthenticated)

        viewModel.signIn("9876543210", "demo")
        advanceUntilIdle()

        assertTrue(viewModel.uiState.value.isAuthenticated)
        assertTrue(repository.currentSession() != null)

        viewModel.signOut()
        advanceUntilIdle()

        assertFalse(viewModel.uiState.value.isAuthenticated)
        assertTrue(repository.currentSession() == null)
    }
}
