"""
Lioc B2B Platform - AI Assistant & Domain Chemical SOP Engine Tests
"""


def test_assistant_chat_endpoint_marble_flooring(client):
    payload = {
        "message": "How do I clean Italian marble floors without damaging polish?",
        "facility_type": "Hotels & Guest Houses",
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "reply" in data
    assert "suggested_products" in data
    assert isinstance(data["suggested_products"], list)
    assert len(data["suggested_products"]) >= 1
    assert "White Herbal" in data["reply"] or "Floor" in data["reply"]
    assert "dilution_guide" in data
    assert "safety_warnings" in data
    assert "suggested_questions" in data
    assert "whatsapp_message" in data


def test_assistant_chat_endpoint_drain_declogging(client):
    payload = {
        "message": "How to unclog a commercial kitchen fat trap and drain choke?",
        "facility_type": "Restaurants & Cafes",
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "Caustic Soda" in data["reply"] or "drain" in data["reply"].lower()
    assert len(data["suggested_products"]) >= 1
    assert data["dilution_guide"] is not None


def test_assistant_chat_endpoint_empty_message_validation(client):
    payload = {
        "message": "",
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 422
