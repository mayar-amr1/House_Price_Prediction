import logging

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services.inference import model_service
from app.services.preprocessing import request_to_dataframe

logger = logging.getLogger(__name__)
router = APIRouter()


def _format_inr(amount: float) -> str:
    """Format a rupee amount the way Indian listings display it (Lac / Cr)."""
    if amount >= 1e7:
        return f"₹{amount / 1e7:.2f} Cr"
    if amount >= 1e5:
        return f"₹{amount / 1e5:.2f} Lac"
    return f"₹{amount:,.0f}"


@router.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.post("/predict", response_model=PredictionResponse, tags=["prediction"])
def predict(payload: PredictionRequest) -> PredictionResponse:
    if not model_service.is_loaded:
        raise HTTPException(status_code=503, detail="Model is not loaded yet.")

    try:
        X = request_to_dataframe(payload)
        predicted_price = model_service.predict(X)
    except Exception:  # noqa: BLE001
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed.")

    return PredictionResponse(
        predicted_price=round(predicted_price, 2),
        predicted_price_formatted=_format_inr(predicted_price),
    )
