package com.retailiq.android.core.session

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import com.retailiq.android.core.model.Session

interface SessionStore {
    fun current(): Session?
    fun save(session: Session)
    fun clear()
}

class InMemorySessionStore : SessionStore {
    private var session: Session? = null

    override fun current(): Session? = session

    override fun save(session: Session) {
        this.session = session
    }

    override fun clear() {
        session = null
    }
}

class EncryptedPreferencesSessionStore(
    context: Context,
) : SessionStore {
    private val preferences by lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)

        EncryptedSharedPreferences.create(
            PREFERENCES_NAME,
            masterKeyAlias,
            context,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    }

    override fun current(): Session? {
        val accessToken = preferences.getString(KEY_ACCESS_TOKEN, null) ?: return null
        val refreshToken = preferences.getString(KEY_REFRESH_TOKEN, null) ?: return null
        val userId = preferences.getLong(KEY_USER_ID, -1L)
        if (userId < 0L) return null

        val storeId = if (preferences.contains(KEY_STORE_ID)) preferences.getLong(KEY_STORE_ID, -1L) else null
        val role = preferences.getString(KEY_ROLE, null)

        return Session(
            accessToken = accessToken,
            refreshToken = refreshToken,
            userId = userId,
            storeId = storeId?.takeIf { it >= 0L },
            role = role,
        )
    }

    override fun save(session: Session) {
        preferences.edit()
            .putString(KEY_ACCESS_TOKEN, session.accessToken)
            .putString(KEY_REFRESH_TOKEN, session.refreshToken)
            .putLong(KEY_USER_ID, session.userId)
            .apply {
                if (session.storeId == null) {
                    remove(KEY_STORE_ID)
                } else {
                    putLong(KEY_STORE_ID, session.storeId)
                }
            }
            .putString(KEY_ROLE, session.role)
            .apply()
    }

    override fun clear() {
        preferences.edit()
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .remove(KEY_USER_ID)
            .remove(KEY_STORE_ID)
            .remove(KEY_ROLE)
            .apply()
    }

    private companion object {
        const val PREFERENCES_NAME = "retailiq_session"
        const val KEY_ACCESS_TOKEN = "access_token"
        const val KEY_REFRESH_TOKEN = "refresh_token"
        const val KEY_USER_ID = "user_id"
        const val KEY_STORE_ID = "store_id"
        const val KEY_ROLE = "role"
    }
}
