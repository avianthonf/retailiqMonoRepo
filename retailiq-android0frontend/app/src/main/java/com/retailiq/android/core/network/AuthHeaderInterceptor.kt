package com.retailiq.android.core.network

import com.retailiq.android.core.session.SessionStore
import okhttp3.Interceptor
import okhttp3.Response

class AuthHeaderInterceptor(
    private val sessionStore: SessionStore,
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val path = request.url.encodedPath

        if (isAuthEndpointWithoutBearer(path)) {
            return chain.proceed(request)
        }

        val token = sessionStore.current()?.accessToken?.takeIf { it.isNotBlank() }
            ?: return chain.proceed(request)

        val authorizedRequest = request.newBuilder()
            .header("Authorization", "Bearer $token")
            .build()

        return chain.proceed(authorizedRequest)
    }

    private fun isAuthEndpointWithoutBearer(path: String): Boolean {
        return path.startsWith("/api/v1/auth/") && !path.endsWith("/logout")
    }
}
