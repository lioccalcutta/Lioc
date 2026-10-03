"""
Lioc B2B Platform - Virtual Hygiene Auditor & ROI Calculation Tests
"""

from unittest.mock import patch


def test_auditor_calculate_endpoint_for_hotels(client):
    """Verify algorithmic chemical calculation, ROI savings, and SOP output for hotels."""
    payload = {
        "facility_type": "hotels_guest_houses",
        "floor_area_sqft": 40000,
        "units_count": 60,
        "restrooms_count": 15,
        "footfall_level": "HIGH",
        "has_commercial_kitchen": True,
        "challenges": ["hard_water", "marble_floors", "odor_issues"],
    }
    response = client.post("/api/v1/auditor/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["audit_id"].startswith("LA-")
    assert "Hotels" in data["facility_type_label"]
    assert data["floor_area_sqft"] == 40000
    assert data["total_monthly_concentrate_litres"] > 0
    assert data["total_ready_solution_litres"] > data["total_monthly_concentrate_litres"]

    # Check ROI metrics
    roi = data["roi"]
    assert roi["monthly_savings"] > 0
    assert roi["annual_savings"] == roi["monthly_savings"] * 12
    assert roi["savings_percentage"] > 20
    assert roi["cost_per_litre_diluted"] < 5.0

    # Check Zones
    zones = data["zones"]
    zone_names = [z["zone_name"] for z in zones]
    assert "Floor & Surface Care" in zone_names
    assert "Restroom & Ceramic Hygiene" in zone_names
    assert "Kitchen & Food Service Degreasing" in zone_names

    # Check SOPs
    assert len(data["sops"]) >= 3
    assert any("White Herbal" in s["chemical_used"] for s in data["sops"])


def test_auditor_calculate_endpoint_for_hospitals(client):
    """Verify chemical calculation for hospital infection control."""
    payload = {
        "facility_type": "hospitals_healthcare",
        "floor_area_sqft": 60000,
        "units_count": 100,
        "restrooms_count": 30,
        "footfall_level": "VERY_HIGH_24X7",
        "has_commercial_kitchen": False,
        "challenges": ["high_infection_risk", "odor_issues"],
    }
    response = client.post("/api/v1/auditor/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["audit_id"].startswith("LA-")
    assert "Hospitals" in data["facility_type_label"]
    assert data["total_monthly_concentrate_litres"] >= 50
    assert data["roi"]["monthly_savings"] > 5000


def test_auditor_submit_lead_dispatches_email(client):
    """Verify that submitting an audit report persists as a lead and triggers customer confirmation email."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "audit_id": "LA-260901-TEST01",
            "full_name": "Dr. Arindam Sen",
            "company_name": "Apollo City Hospital Kolkata",
            "email": "arindam@apollocity.org",
            "phone_number": "+91 98311 22334",
            "city": "Kolkata",
            "additional_notes": "Require NABH compliant disinfectant certificate.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/auditor/submit", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        ref_id = data["reference_id"]
        assert ref_id.startswith("LQ-") or ref_id.startswith("LA-")

        # Verify dual email dispatch
        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "arindam@apollocity.org")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body
