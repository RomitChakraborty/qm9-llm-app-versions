from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class Fact(BaseModel):
    speaker: str
    timestamp: datetime
    assertion: str
    evidence_url: Optional[HttpUrl] = None

class Persona(BaseModel):
    name: str
    jurisdiction: str
    start_date: datetime
    injury_type: str

class PredictionRequest(BaseModel):
    persona: Persona
    facts: List[Fact]

class PredictionResult(BaseModel):
    score: float
    explanation: str
