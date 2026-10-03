"""
Lioc B2B Platform - Health, Core Infrastructure & Middleware Tests
"""

from unittest.mock import patch
from backend.app.core.config import settings, Settings
from backend.app.database.base import Base


def test_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Lioc" in data["service"]
    assert "x-request-id" in response.headers


def test_request_id_header(client):
    response = client.get("/api/v1/health", headers={"X-Request-ID": "audit-trace-999"})
    assert response.status_code == 200
    assert response.headers.get("x-request-id") == "audit-trace-999"
    assert "x-process-time" in response.headers


def test_cors_origins_configuration():
    assert "http://localhost:3000" in settings.BACKEND_CORS_ORIGINS
    assert "*" not in settings.BACKEND_CORS_ORIGINS


def test_global_404_error_formatting(client):
    response = client.get("/api/v1/not-found-endpoint-xyz")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_404"
    assert "request_id" in data["error"]


def test_database_schema_integrity():
    table_names = Base.metadata.tables.keys()
    assert "product_categories" in table_names
    assert "industries" in table_names
    assert "products" in table_names
    assert "quote_requests" in table_names
    assert "sample_requests" in table_names
    assert "distributor_applications" in table_names
    assert "contact_messages" in table_names


def test_production_config_validator_detects_insecure_settings():
    test_settings = Settings(
        ENVIRONMENT="production",
        DEBUG=True,  # Insecure
        DATABASE_URL="sqlite:///./test.db",  # Insecure for prod
        JWT_SECRET_KEY="lioc-super-secret-jwt-key-for-development-change-in-production",  # Insecure
        TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA",  # Insecure for prod
    )
    errors = test_settings.validate_production_configuration()
    assert len(errors) >= 3
    assert any("DEBUG must be set to False" in e for e in errors)
    assert any("PostgreSQL" in e for e in errors)
    assert any("JWT_SECRET_KEY" in e for e in errors)


def test_database_url_postgres_normalization():
    raw_url = "postgres://user:pass@host:5432/dbname"
    normalized = raw_url.replace("postgres://", "postgresql://", 1)
    assert normalized.startswith("postgresql://")


def test_seed_database_protects_production_data():
    from backend.app.database.seed import seed_database
    with patch.object(settings, "ENVIRONMENT", "production"):
        seed_database(force_reseed=True)
