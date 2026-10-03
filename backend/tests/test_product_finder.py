"""
Lioc B2B Platform - Product Finder Algorithm & Recommendation Scoring Tests
"""


def test_product_finder_options_endpoint(client):
    response = client.get("/api/v1/product-finder/options")
    assert response.status_code == 200
    data = response.json()
    assert "industries" in data
    assert "categories" in data
    assert "context_challenges" in data
    assert len(data["industries"]) >= 5
    assert len(data["categories"]) >= 6
    assert len(data["context_challenges"]) >= 6


def test_product_finder_recommendations_exact_match(client):
    # Hotel (id=1) + Floor Cleaners (id=1)
    response = client.get("/api/v1/product-finder/recommendations?industry_id=1&category_id=1")
    assert response.status_code == 200
    data = response.json()
    assert data["total_recommendations"] >= 1
    assert "recommendations" in data

    top_rec = data["recommendations"][0]
    assert top_rec["rank"] == 1
    assert top_rec["score"] >= 100
    assert top_rec["match_type"] == "EXACT_MATCH"
    assert "floor-cleaner" in top_rec["product"]["slug"]
    assert "reason" in top_rec
    assert len(top_rec["reason"]) > 0


def test_product_finder_recommendations_context_boost(client):
    cats_res = client.get("/api/v1/categories")
    assert cats_res.status_code == 200
    kitchen_cat = next((c for c in cats_res.json() if "degreaser" in c["slug"] or "kitchen" in c["slug"]), None)
    cat_id = kitchen_cat["id"] if kitchen_cat else 4

    response = client.get(
        f"/api/v1/product-finder/recommendations?industry_id=2&category_id={cat_id}&context=grease_oil"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_recommendations"] >= 1

    top_rec = data["recommendations"][0]
    assert top_rec["match_type"] == "EXACT_MATCH"
    assert "degreaser" in top_rec["product"]["slug"] or "dishwash" in top_rec["product"]["slug"]
    assert top_rec["score"] > 100  # Exact match (100) + context boost (>10)


def test_product_finder_recommendations_invalid_limit(client):
    response = client.get("/api/v1/product-finder/recommendations?limit=999")
    assert response.status_code == 422


def test_product_finder_lead_source_attribution(client):
    payload = {
        "full_name": "Saurav Das",
        "company_name": "Park Street Fine Dine",
        "phone_number": "+91 98355 66778",
        "email": "saurav@parkstreetdining.in",
        "business_type": "Restaurants, Cafes & Cloud Kitchens",
        "city": "Kolkata",
        "product_interested_in": "Lioc KitchenMaster Heavy-Duty Degreaser",
        "source": "PRODUCT_FINDER",
        "turnstile_token": "test-turnstile-token",
    }
    submit_res = client.post("/api/v1/quotes", json=payload)
    assert submit_res.status_code == 201
    ref_id = submit_res.json()["reference_id"]

    # Verify admin lead retrieval includes source attribute
    login_res = client.post(
        "/api/v1/admin/login",
        json={"email": "lioccalcutta@gmail.com", "password": "lioc@02022026"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    leads_res = client.get(f"/api/v1/admin/leads?search={ref_id}", headers=headers)
    assert leads_res.status_code == 200
    leads = leads_res.json()["items"]
    assert len(leads) >= 1
    target_lead = next(l for l in leads if l["reference_id"] == ref_id)
    assert target_lead["source"] == "PRODUCT_FINDER"
