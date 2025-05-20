from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_predict():
    payload = {
        "persona": {
            "name": "Alice",
            "jurisdiction": "CA",
            "start_date": "2023-01-01T00:00:00",
            "injury_type": "contract"
        },
        "facts": [
            {"speaker": "Bob", "timestamp": "2023-01-02T00:00:00", "assertion": "Broke agreement"}
        ]
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
