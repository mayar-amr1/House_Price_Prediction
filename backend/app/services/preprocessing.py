import json
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.core.config import get_settings
from app.schemas.prediction import PredictionRequest

# Same cap applied to the training data in notebooks/house_price_model.ipynb
# (section 2.3 — outlier handling for Covered Parking / Open Parking).
PARKING_CAP = 6


@lru_cache
def get_known_locations() -> set[str]:
    settings = get_settings()
    path = Path(settings.locations_path)
    with open(path) as f:
        return set(json.load(f))


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    """Turn a validated request into the exact one-row DataFrame shape the
    exported sklearn Pipeline expects (see notebooks/house_price_model.ipynb,
    section 2.4).

    Because the pipeline bundles imputation/scaling/one-hot-encoding, no
    manual encoding happens here — we just rename fields to the training-time
    column names, cap parking counts the same way training data was capped,
    and fall back unknown locations to "other" (mirrors
    OneHotEncoder(handle_unknown="ignore") + the training-time top-30
    location grouping).
    """
    known_locations = get_known_locations()
    location = payload.location.strip().lower()
    location_grouped = location if location in known_locations else "other"

    row = {
        "BHK": payload.bhk,
        "Floor": payload.floor,
        "bathroom_num": payload.bathroom,
        "balcony_num": payload.balcony,
        "covered_parking_capped": min(payload.covered_parking, PARKING_CAP),
        "open_parking_capped": min(payload.open_parking, PARKING_CAP),
        "Garden/Park": int(payload.garden_park),
        "Main Road": int(payload.main_road),
        "Pool": int(payload.pool),
        "location_grouped": location_grouped,
        "transaction_clean": payload.transaction,
        "furnishing_clean": payload.furnishing,
    }
    return pd.DataFrame([row])
