package com.retailiq.android

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.feature.auth.AuthScreen
import com.retailiq.android.ui.theme.RetailIqTheme
import org.junit.Rule
import org.junit.Test

class AuthScreenTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun authScreenShowsPrimaryEntryAction() {
        composeRule.setContent {
            RetailIqTheme {
                AuthScreen(
                    repository = RetailIqRepository.create(),
                    isLoading = false,
                    errorMessage = null,
                    onSignIn = { _, _ -> },
                )
            }
        }

        composeRule.onNodeWithText("RetailIQ Android").assertIsDisplayed()
        composeRule.onNodeWithText("Sign In").assertIsDisplayed()
    }
}
