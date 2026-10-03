"""
Lioc B2B Platform - Product Catalog, Categories & Industries Tests
"""


def test_categories_endpoint(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    slugs = [c["slug"] for c in data]
    assert "floor-cleaners" in slugs
    assert "toilet-washroom" in slugs


def test_industries_endpoint(client):
    response = client.get("/api/v1/industries")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    hotel_industry = client.get("/api/v1/industries/hotels-guest-houses")
    assert hotel_industry.status_code == 200
    assert "Hotels" in hotel_industry.json()["name"]


def test_products_endpoint(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 6

    # Test single product detail
    product_slug = data[0]["slug"]
    detail_res = client.get(f"/api/v1/products/{product_slug}")
    assert detail_res.status_code == 200
    product = detail_res.json()
    assert product["slug"] == product_slug
    assert "category" in product
    assert "industries" in product
