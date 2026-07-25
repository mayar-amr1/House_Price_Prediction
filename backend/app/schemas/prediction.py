from typing import Literal

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Input features required by the trained pipeline.

    Field names mirror the columns the model was trained on in
    notebooks/house_price_model.ipynb, section 2.4 (numeric_features +
    categorical_features). The API accepts friendly snake_case fields and
    `app/services/preprocessing.py` maps them onto the exact training-time
    column names before calling the pipeline.
    """

    location: str = Field(..., description="City/location, e.g. 'bangalore'")
    bhk: int = Field(..., ge=1, le=20, description="Number of bedrooms (BHK)")
    floor: int = Field(..., ge=0, le=100, description="Floor number")
    bathroom: int = Field(..., ge=0, le=20)
    balcony: int = Field(..., ge=0, le=20)
    covered_parking: int = Field(0, ge=0, le=50, description="Raw value; the model caps it at 6 internally")
    open_parking: int = Field(0, ge=0, le=50, description="Raw value; the model caps it at 6 internally")
    garden_park: bool = False
    main_road: bool = False
    pool: bool = False
    furnishing: Literal["Furnished", "Semi-Furnished", "Unfurnished"] = "Unfurnished"
    transaction: Literal["New Property", "Resale", "Other", "Rent/Lease"] = "Resale"

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float
    predicted_price_formatted: str


class HealthResponse(BaseModel):
    status: str
