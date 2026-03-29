"""Tests for config bootstrap defaults."""

from config import LOCAL_POSTGRES_DB, LOCAL_POSTGRES_PASSWORD, LOCAL_POSTGRES_USER, build_postgres_url


def test_build_postgres_url_uses_local_defaults(monkeypatch):
    for name in ("DATABASE_URL", "POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "POSTGRES_PORT"):
        monkeypatch.delenv(name, raising=False)

    assert build_postgres_url() == (
        f"postgresql://{LOCAL_POSTGRES_USER}:{LOCAL_POSTGRES_PASSWORD}@localhost:5432/{LOCAL_POSTGRES_DB}"
    )


def test_build_postgres_url_honors_environment_overrides(monkeypatch):
    monkeypatch.setenv("POSTGRES_USER", "custom_user")
    monkeypatch.setenv("POSTGRES_PASSWORD", "custom_pass")
    monkeypatch.setenv("POSTGRES_DB", "custom_db")
    monkeypatch.setenv("POSTGRES_PORT", "6543")

    assert build_postgres_url() == "postgresql://custom_user:custom_pass@localhost:6543/custom_db"
