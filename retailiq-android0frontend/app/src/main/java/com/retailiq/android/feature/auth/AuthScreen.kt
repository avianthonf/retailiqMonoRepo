package com.retailiq.android.feature.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.retailiq.android.core.data.RetailIqRepository
import com.retailiq.android.core.model.AuthMode
import com.retailiq.android.core.model.AuthPanel

@Composable
fun AuthScreen(
    modifier: Modifier = Modifier,
    repository: RetailIqRepository,
    isLoading: Boolean,
    errorMessage: String?,
    authMessage: String?,
    onSubmitAuth: (AuthMode, Map<String, String>) -> Unit,
) {
    var mobile by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var storeName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("") }

    var panels by remember { mutableStateOf<List<AuthPanel>>(emptyList()) }
    var selectedIndex by remember { mutableIntStateOf(0) }

    LaunchedEffect(repository) {
        panels = repository.authPanels()
    }

    val panel = panels.getOrNull(selectedIndex)
    val mode = panel?.mode ?: AuthMode.SignIn

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
                    "Mobile-first operator app for RetailIQ — sign in, register, or recover access below.",
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
                            onClick = {
                                selectedIndex = index
                                mobile = ""; password = ""; fullName = ""
                                storeName = ""; email = ""; otp = ""
                            },
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

                    when (mode) {
                        AuthMode.SignIn -> {
                            OutlinedTextField(
                                value = password,
                                onValueChange = { password = it },
                                label = { Text("Password") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                                visualTransformation = PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            )
                        }
                        AuthMode.Register -> {
                            OutlinedTextField(
                                value = fullName,
                                onValueChange = { fullName = it },
                                label = { Text("Full Name") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                            )
                            OutlinedTextField(
                                value = password,
                                onValueChange = { password = it },
                                label = { Text("Password") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                                visualTransformation = PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                            )
                            OutlinedTextField(
                                value = storeName,
                                onValueChange = { storeName = it },
                                label = { Text("Store Name (optional)") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                            )
                            OutlinedTextField(
                                value = email,
                                onValueChange = { email = it },
                                label = { Text("Email (optional)") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                            )
                        }
                        AuthMode.VerifyOtp -> {
                            OutlinedTextField(
                                value = otp,
                                onValueChange = { otp = it },
                                label = { Text("OTP (6 digits)") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                            )
                        }
                        AuthMode.ResetPassword -> {
                        }
                    }

                    Button(
                        onClick = {
                            val fields = buildMap<String, String> {
                                put("mobile", mobile)
                                put("password", password)
                                put("fullName", fullName)
                                put("storeName", storeName)
                                put("email", email)
                                put("otp", otp)
                            }
                            onSubmitAuth(mode, fields)
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

                    if (!authMessage.isNullOrBlank()) {
                        Text(
                            text = authMessage,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }

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
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Security-first", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                        Text("JWT refresh, encrypted session storage, role-aware routing.", style = MaterialTheme.typography.bodySmall)
                    }
                }
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Operator-friendly", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                        Text("Every backend module maps to a dedicated mobile surface.", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}
