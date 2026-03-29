package com.retailiq.android.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(0xFF0F766E),
    onPrimary = Color(0xFFF4FFFE),
    secondary = Color(0xFF9A3412),
    tertiary = Color(0xFF1D4ED8),
    background = Color(0xFFF6F3EE),
    surface = Color(0xFFFFFBF5),
    surfaceVariant = Color(0xFFE6DED1),
    onSurface = Color(0xFF1F2937),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF4FD1C5),
    onPrimary = Color(0xFF042F2E),
    secondary = Color(0xFFF97316),
    tertiary = Color(0xFF60A5FA),
    background = Color(0xFF101827),
    surface = Color(0xFF172033),
    surfaceVariant = Color(0xFF243045),
    onSurface = Color(0xFFF8FAFC),
)

@Composable
fun RetailIqTheme(content: @Composable () -> Unit) {
    val colors = if (isSystemInDarkTheme()) DarkColors else LightColors

    MaterialTheme(
        colorScheme = colors,
        typography = Typography(),
        content = content,
    )
}
