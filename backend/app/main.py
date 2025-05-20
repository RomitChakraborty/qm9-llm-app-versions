from fastapi import FastAPI
from .models import PredictionRequest, PredictionResult
from .services.merit_model import predict_case_merit

app = FastAPI(title="DoIHaveACase API")

@app.post("/predict", response_model=PredictionResult)
def predict(req: PredictionRequest):
    return predict_case_merit(req.facts, req.persona)
