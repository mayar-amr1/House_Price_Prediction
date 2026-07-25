from fastapi.testclient import TestClient

from app.main import app

VALID_PAYLOAD = {
    "location": "bangalore",
    "bhk": 3,
    "floor": 4,
    "bathroom": 2,
    "balcony": 1,
    "covered_parking": 1,
    "open_parking": 0,
    "garden_park": True,
    "main_road": False,
    "pool": False,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
}


def test_health() -> None:
    with TestClient(app) as c:  # triggers the lifespan -> loads the model once
        response = c.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path() -> None:
    with TestClient(app) as c:
        response = c.post("/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert body["predicted_price"] > 0
    assert "Cr" in body["predicted_price_formatted"] or "Lac" in body["predicted_price_formatted"]


def test_predict_unknown_location_falls_back_to_other() -> None:
    payload = {**VALID_PAYLOAD, "location": "a-city-that-does-not-exist"}
    with TestClient(app) as c:
        response = c.post("/predict", json=payload)
    assert response.status_code == 200
    assert response.json()["predicted_price"] > 0


def test_predict_invalid_input_returns_422() -> None:
    payload = {**VALID_PAYLOAD, "bhk": "not-a-number"}
    with TestClient(app) as c:
        response = c.post("/predict", json=payload)
    assert response.status_code == 422
