"""
Lioc B2B Platform - Lead Generation, Submissions, Anti-Spam & Notifications Tests
"""

from unittest.mock import patch
import anyio
from backend.app.core.config import settings
from backend.app.services.antispam_service import verify_turnstile_token


def test_submit_quote_request(client):
    payload = {
        "full_name": "Rajesh Sharma",
        "company_name": "Grand Bengal Heritage Hotel",
        "phone_number": "+91 98300 12345",
        "email": "rajesh@grandbengal.com",
        "business_type": "Hotels and Guest Houses",
        "city": "Kolkata",
        "product_interested_in": "Floor Cleaner & Disinfectant Bulk Cans",
        "estimated_quantity": "500 Litres",
        "monthly_requirement": "500 Litres / Month",
        "message": "Looking for weekly bulk delivery in Salt Lake area.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/quotes", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LQ-")


def test_submit_sample_request(client):
    payload = {
        "full_name": "Ananya Sen",
        "company_name": "Sen Cloud Kitchens",
        "phone_number": "+91 98311 98765",
        "email": "ananya@senkitchens.in",
        "business_type": "Restaurants, Cafes & Cloud Kitchens",
        "business_address": "Plot 45, Sector V, Salt Lake",
        "city": "Kolkata",
        "product_interested_in": "Lioc KitchenMaster Heavy-Duty Degreaser",
        "expected_monthly_requirement": "100 Litres",
        "message": "Need trial sample to test on commercial fryer exhaust hoods.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/samples", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LS-")


def test_submit_distributor_application(client):
    payload = {
        "applicant_name": "Vikram Agarwal",
        "company_name": "Agarwal Enterprise Hygiene Supplies",
        "phone_number": "+91 98322 45678",
        "email": "vikram@agarwalenterprises.co.in",
        "gst_number": "19AAAAA0000A1Z5",
        "city": "Howrah",
        "state": "West Bengal",
        "years_experience": "8 Years",
        "current_products_distributed": "Housekeeping consumables & tissue papers",
        "investment_capacity": "INR 5 - 10 Lakhs",
        "message": "Interested in exclusive dealership for Howrah & Hooghly commercial zones.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/distributors", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LD-")


def test_submit_contact_message(client):
    payload = {
        "full_name": "Siddharth Roy",
        "email": "siddharth@royproperties.com",
        "phone_number": "+91 98333 11223",
        "company_name": "Roy Commercial Properties",
        "subject": "Facility supply contract inquiry",
        "message": "We manage 3 commercial office towers in New Town and want to discuss annual supply pricing.",
        "turnstile_token": "test-turnstile-token",
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["reference_id"].startswith("LC-")


def test_email_failure_does_not_break_lead_submission(client):
    """Verify that SMTP failures are non-blocking and lead remains safely in the database."""
    with patch("backend.app.services.email_service.email_service._send_raw_email") as mock_email:
        mock_email.side_effect = Exception("Simulated SMTP Provider Connection Timeout")

        payload = {
            "full_name": "Amitava Mukherjee",
            "company_name": "Kolkata Tech Hub Cafeteria",
            "phone_number": "+91 98344 55667",
            "email": "amitava@techhubcafe.in",
            "business_type": "Corporate Offices & IT Parks",
            "city": "Kolkata",
            "product_interested_in": "Antibacterial Floor Cleaner",
            "estimated_quantity": "200 Litres",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/quotes", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["reference_id"].startswith("LQ-")


def test_form_validation_error(client):
    # Missing required fields like email and phone_number
    payload = {
        "full_name": "Incomplete User",
    }
    response = client.post("/api/v1/quotes", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "details" in data["error"]


def test_quote_submission_dispatches_customer_confirmation_email(client):
    """Verify that quote submissions dispatch a confirmation email to customer with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "full_name": "Kalyan Bhattacharya",
            "company_name": "Bhattacharya Banquet Halls",
            "phone_number": "+91 98366 11223",
            "email": "kalyan@banquethalls.in",
            "business_type": "Hotels and Guest Houses",
            "city": "Kolkata",
            "product_interested_in": "Floor Cleaner & Air Freshener Combo",
            "estimated_quantity": "300 Litres",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/quotes", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        assert mock_send_async.call_count == 2
        calls = mock_send_async.call_args_list

        customer_call = next(c for c in calls if c[0][0] == "kalyan@banquethalls.in")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert "Our Team Will Reach Out Shortly" in subject
        assert ref_id in html_body
        assert "reach out to you shortly" in html_body
        assert ref_id in text_body


def test_contact_submission_dispatches_customer_confirmation_email(client):
    """Verify that contact queries dispatch a confirmation email to user with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "full_name": "Mousumi Banerjee",
            "email": "mousumi@banerjee-clinic.org",
            "phone_number": "+91 98377 88990",
            "company_name": "Banerjee Wellness Clinic",
            "subject": "Hospital Grade Sanitizer and Floor Cleaner Inquiry",
            "message": "We need bulk supply of hospital grade sanitizers delivered monthly.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/contact", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "mousumi@banerjee-clinic.org")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert ref_id in html_body


def test_sample_submission_dispatches_customer_confirmation_email(client):
    """Verify that free sample kit requests dispatch a confirmation email with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "full_name": "Rohan Gupta",
            "company_name": "Gupta Tech Solutions Cafe",
            "phone_number": "+91 98388 99001",
            "email": "rohan@guptatech.com",
            "business_type": "Corporate Offices & IT Parks",
            "business_address": "Sector V, Salt Lake, Plot 12",
            "city": "Kolkata",
            "product_interested_in": "Lioc Antibacterial Floor Soap",
            "expected_monthly_requirement": "50 Litres",
            "message": "Testing for office floor cleaning trial.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/samples", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "rohan@guptatech.com")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert ref_id in html_body


def test_distributor_submission_dispatches_customer_confirmation_email(client):
    """Verify that dealership applications dispatch a confirmation email with reference ID."""
    with patch("backend.app.services.email_service.email_service.send_async") as mock_send_async:
        payload = {
            "applicant_name": "Subhashish Ghosh",
            "company_name": "Ghosh Distribution Hub",
            "phone_number": "+91 98399 00112",
            "email": "subhashish@ghoshdistribution.com",
            "gst_number": "19BBBBB0000B1Z6",
            "city": "Durgapur",
            "state": "West Bengal",
            "years_experience": "12 Years",
            "current_products_distributed": "Industrial Chemicals & Cleaning Agents",
            "investment_capacity": "INR 10 - 25 Lakhs",
            "message": "Ready to take up master distribution for Burdwan & Durgapur industrial belt.",
            "turnstile_token": "test-turnstile-token",
        }
        response = client.post("/api/v1/distributors", json=payload)
        assert response.status_code == 201
        ref_id = response.json()["reference_id"]

        assert mock_send_async.call_count == 2
        customer_call = next(c for c in mock_send_async.call_args_list if c[0][0] == "subhashish@ghoshdistribution.com")
        recipient, subject, html_body, text_body = customer_call[0][:4]

        assert "[LIOC]" in subject
        assert ref_id in subject
        assert ref_id in html_body


def test_turnstile_enforces_verification_in_production():
    """Verify that in production, Turnstile queries the API and rejects invalid/rejected tokens."""
    with patch.object(settings, "ENVIRONMENT", "production"):
        with patch.object(settings, "TURNSTILE_ENABLED", True):
            with patch.object(settings, "TURNSTILE_SECRET_KEY", "0x4AAAAAA_REAL_PRODUCTION_SECRET"):
                assert anyio.run(verify_turnstile_token, None) is False

                with patch("httpx.AsyncClient.post") as mock_post:
                    mock_post.return_value.json.return_value = {"success": False, "error-codes": ["invalid-input-response"]}
                    assert anyio.run(verify_turnstile_token, "invalid-token-123") is False
