import joblib

from app.core.config import get_settings


class ModelService:
    """Wraps the trained sklearn Pipeline. Loaded once at app startup
    (see app/main.py lifespan) and reused across every request."""

    def __init__(self) -> None:
        self._model = None

    def load(self) -> None:
        settings = get_settings()
        self._model = joblib.load(settings.model_path)

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def predict(self, X) -> float:
        if self._model is None:
            raise RuntimeError("Model is not loaded yet.")
        # The exported pipeline was trained directly on price (not log-target
        # — see the model comparison in notebooks/house_price_model.ipynb,
        # section 2.5), so no inverse transform is needed here.
        return float(self._model.predict(X)[0])


model_service = ModelService()
