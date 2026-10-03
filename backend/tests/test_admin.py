"""
Lioc B2B Platform - CEO & Admin Authentication, Lead Triage & Security Tests
"""

from backend.app.core.config import settings
from backend.app.core.security import hash_password, verify_password


def test_pbkdf2_password_hashing_and_verification():
    raw_password = "secure_production_password_2026"
    hashed = hash_password(raw_password)
    assert hashed.startswith("pbkdf2_sha256$100000$")
    assert verify_password(raw_password, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_admin_login_success(client):
    payload = {
        "email": "lioccalcutta@gmail.com",
        "password": "lioc@02022026",
    }
    response = client.post("/api/v1/admin/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["admin_user"]["email"] == "lioccalcutta@gmail.com"


def test_admin_login_with_pbkdf2_hash(client):
    original_hash = settings.ADMIN_PASSWORD_HASH
    test_pass = "ceo_secret_key_999"
    settings.ADMIN_PASSWORD_HASH = hash_password(test_pass)

    try:
        # Correct password against hash
        res = client.post(
            "/api/v1/admin/login",
            json={"email": "lioccalcutta@gmail.com", "password": test_pass},
        )
        assert res.status_code == 200
        assert "access_token" in res.json()

        # Wrong password against hash
        res_fail = client.post(
            "/api/v1/admin/login",
            json={"email": "lioccalcutta@gmail.com", "password": "wrong_password"},
        )
        assert res_fail.status_code == 401
    finally:
        settings.ADMIN_PASSWORD_HASH = original_hash


def test_admin_login_invalid_password(client):
    payload = {
        "email": "lioccalcutta@gmail.com",
        "password": "wrongpassword",
    }
    response = client.post("/api/v1/admin/login", json=payload)
    assert response.status_code == 401


def test_admin_unauthorized_access(client):
    response = client.get("/api/v1/admin/stats")
    assert response.status_code in [401, 403]


def test_admin_invalid_jwt_token(client):
    headers = {"Authorization": "Bearer invalid.fake.token"}
    response = client.get("/api/v1/admin/me", headers=headers)
    assert response.status_code == 401


def test_admin_protected_endpoints(client):
    login_res = client.post(
        "/api/v1/admin/login",
        json={"email": "lioccalcutta@gmail.com", "password": "lioc@02022026"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Test /me
    me_res = client.get("/api/v1/admin/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "lioccalcutta@gmail.com"

    # Test /stats
    stats_res = client.get("/api/v1/admin/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_inquiries" in stats
    assert stats["total_inquiries"] >= 0

    # Test /leads
    leads_res = client.get("/api/v1/admin/leads", headers=headers)
    assert leads_res.status_code == 200
    leads_data = leads_res.json()
    assert "items" in leads_data
    assert isinstance(leads_data["items"], list)
