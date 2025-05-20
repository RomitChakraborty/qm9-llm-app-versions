from typing import List

from ..models import Fact, Persona, PredictionResult


def predict_case_merit(facts: List[Fact], persona: Persona) -> PredictionResult:
    """Dummy merit scoring based on number of facts."""
    score = min(1.0, len(facts) * 0.1)
    explanation = (
        f"Score derived from {len(facts)} facts for {persona.name} in {persona.jurisdiction}."
    )
    return PredictionResult(score=score, explanation=explanation)
