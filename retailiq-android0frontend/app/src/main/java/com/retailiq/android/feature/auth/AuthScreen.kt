package com.retailiq.android.feature.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.unit.dp
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.AuthPanel
import com.retailiq.android.ui.components.InsightCard
import kotlinx.coroutines.launch

@Composable
fun AuthScreen(
    modifier: Modifier = Modifier,
    repository: RetailIqRepository,
    isLoading: Boolean,
    errorMessage: String?,
    onSignIn: (String, String) -> Unit,
) {
    var mobile by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var panels by remember { mutableStateOf<List<AuthPanel>>(emptyList()) }
    var selectedIndex by remember { mutableIntStateOf(0) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(repository) {
        panels = repository.authPanels()
    }

    val panel = panels.getOrNull(selectedIndex)

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("RetailIQ Android", style = MaterialTheme.typography.displaySmall, fontWeight = FontWeight.Bold)
                Text(
                    "A mobile-first frontend for RetailIQ operations. This build covers the core operator journeys and maps the wider backend into expandable Android modules.",
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }

        item {
            if (panels.isNotEmpty()) {
                PrimaryTabRow(selectedTabIndex = selectedIndex) {
                    panels.forEachIndexed { index, authPanel ->
                        Tab(
                            selected = index == selectedIndex,
                            onClick = { selectedIndex = index },
                            text = { Text(authPanel.mode.label) },
                        )
                    }
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(28.dp),
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    Text(panel?.title ?: "Store entry", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                    Text(panel?.description ?: "Mobile sign-in flow for owners and staff.", style = MaterialTheme.typography.bodyMedium)

                    OutlinedTextField(
                        value = mobile,
                        onValueChange = { mobile = it },
                        label = { Text("Mobile Number") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    )

                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password / OTP") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    )

                    Button(
                        onClick = {
                            scope.launch {
                                onSignIn(mobile, password)
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !isLoading,
                    ) {
                        Text(if (isLoading) "Working..." else (panel?.primaryAction ?: "Continue"))
                    }

                    Text(
                        panel?.helperText ?: "Maps to RetailIQ auth endpoints.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.secondary,
                    )

                    if (!errorMessage.isNullOrBlank()) {
                        Text(
                            text = errorMessage,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.error,
                        )
                    }
                }
            }
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                InsightCard(
                    title = "Security-first",
                    body = "The app is structured for JWT refresh, role-aware routing, and secure token storage work next.",
                    footnote = "Auth + session",
                    modifier = Modifier.weight(1f),
                )
                InsightCard(
                    title = "Operator-friendly",
                    body = "Every major backend area becomes a mobile module instead of a desktop-only afterthought.",
                    footnote = "Navigation + modules",
                    modifier = Modifier.weight(1f),
                )
            }
        }

        item {
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.CenterStart,
            ) {
                Text(
                    "Signing in currently enters the verified app shell directly. The additional auth tabs are the completion path for registration, OTP, and password recovery screens.",
                    style = MaterialTheme.typography.bodySmall,
                )
            }
        }
    }
}
