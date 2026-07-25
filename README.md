## Demo Video
https://github.com/user-attachments/assets/46a73c9d-ef14-4649-8dea-63a6fb451fba
# Estimate — House Price Prediction (End-to-End ML Web App)

A complete machine-learning product: a cleaned dataset → a trained regression
model → a FastAPI backend → a React/TypeScript frontend, all wired together
and ready to run locally.

Given a property's city, size, and amenities, **Estimate** returns an instant
market-value prediction (e.g. `₹80.9 Lac`) using a Random Forest model
trained on 177,528 real Indian property listings.

---

## 1. Overview

| | |
|---|---|
| **Dataset** | `house_price_data.csv` — 177,528 Indian property listings across 81 raw locations |
| **Notebook** | Cleans the data, runs EDA, trains & compares 3 models, exports the winner |
| **Model** | `RandomForestRegressor` in a scikit-learn `Pipeline` (R² ≈ **0.874** on the test set) |
| **Backend** | FastAPI serving `POST /predict` and `GET /health` |
| **Frontend** | React + TypeScript + Vite, styled as a land-survey / valuation-plaque UI |

## 2. Architecture

```
                 ┌─────────────────────────┐
                 │   notebooks/            │
                 │   house_price_model      │
                 │   .ipynb                 │
                 │                          │
   raw CSV  ───▶ │  clean → EDA → train    │ ───▶  house_price.pkl
                 │  → evaluate → export     │       locations.json
                 └─────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   backend/ (FastAPI)     │
                 │                          │
                 │  loads .pkl at startup   │ ◀── GET  /health
                 │  POST /predict           │ ◀── POST /predict
                 │  (pandas → pipeline)     │
                 └─────────────────────────┘
                              ▲
                              │ fetch (JSON)
                 ┌─────────────────────────┐
                 │   frontend/ (React)      │
                 │                          │
                 │  PredictionForm          │
                 │  HomePage → ResultPage   │
                 └─────────────────────────┘
```

## 3. Tech stack

- **Modeling:** Python, pandas, scikit-learn, matplotlib, seaborn, joblib
- **Backend:** FastAPI, Pydantic v2, pydantic-settings, uvicorn
- **Frontend:** React 18, TypeScript, Vite, React Router
- **Testing:** pytest + FastAPI `TestClient`

## 4. Project structure

```
house-price-project/
├── notebooks/
│   ├── house_price_model.ipynb   # full data-science workflow (runs top-to-bottom)
│   ├── house_price.pkl           # exported model (also copied into backend/models/)
│   ├── locations.json            # allowed location list (also copied into backend/app/)
│   ├── figures/                  # EDA + evaluation plots (PNG)
│   └── data/
│       └── house_prices.csv      # NOT committed — see "Get the dataset" below
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app, CORS, lifespan model loading
│   │   ├── api/routes/prediction.py   # GET /health, POST /predict
│   │   ├── core/config.py             # Settings from .env (pydantic-settings)
│   │   ├── schemas/prediction.py      # PredictionRequest / PredictionResponse
│   │   ├── services/
│   │   │   ├── preprocessing.py       # request → one-row DataFrame
│   │   │   └── inference.py           # loads .pkl, runs predict
│   │   ├── utils/logging_config.py
│   │   └── locations.json
│   ├── models/house_price.pkl
│   ├── tests/test_prediction.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── api/predictionClient.ts    # fetch wrapper, base URL from VITE_API_BASE_URL
    │   ├── components/
    │   │   ├── PredictionForm.tsx
    │   │   └── CornerMarks.tsx        # blueprint-style corner motif
    │   ├── data/locations.ts          # bundled dropdown options
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   ├── ResultPage.tsx
    │   │   └── NotFoundPage.tsx
    │   ├── types/prediction.ts        # TS types mirroring the backend schema
    │   ├── App.tsx                    # routes: / , /result , * (404)
    │   ├── App.css
    │   └── index.css                  # design tokens
    ├── .env.example
    └── package.json
```

## 5. Get the dataset

The raw CSV isn't committed to this repo (it's ~10 MB and easy to
regenerate). Place your `house_price_data.csv` at
`notebooks/data/house_prices.csv` before running the notebook. The columns
the notebook expects (verified directly with `df.columns` — always check
the real file rather than trusting a dataset description):

```
BHK, Amount(in rupees), Location, Floor, Transaction, Furnishing, Bathroom,
Balcony, Covered Parking, Open Parking, Garden/Park, Main Road, Pool
```

## 6. Run the notebook (optional — the model is already exported)

```bash
cd notebooks
python -m venv .venv
source .venv/bin/activate        # .venv\Scripts\activate on Windows
pip install jupyter pandas numpy scikit-learn matplotlib seaborn joblib
jupyter notebook house_price_model.ipynb
# Kernel → Restart & Run All
```

Re-running it regenerates `house_price.pkl` and `locations.json` — copy
both into `backend/models/` and `backend/app/` respectively if you retrain.

## 7. Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload
# → http://localhost:8000/docs
```

Run the test suite:

```bash
pytest
```

### Environment variables (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `House Price Prediction API` | Shown in `/docs` |
| `MODEL_PATH` | `models/house_price.pkl` | Path to the exported pipeline |
| `LOCATIONS_PATH` | `app/locations.json` | Known-location list used for the "other" fallback |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed frontend origins |

## 8. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env

npm run dev
# → http://localhost:5173
```

### Environment variables (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL |

With the backend running on `:8000` and the frontend on `:5173`, open the
app, fill in a property's details, and submit to see a live prediction.

## 9. API reference

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /predict`

Request body:

```json
{
  "location": "bangalore",
  "bhk": 3,
  "floor": 4,
  "bathroom": 2,
  "balcony": 1,
  "covered_parking": 1,
  "open_parking": 0,
  "garden_park": true,
  "main_road": false,
  "pool": false,
  "furnishing": "Semi-Furnished",
  "transaction": "Resale"
}
```

Response:

```json
{
  "predicted_price": 8089545.0,
  "predicted_price_formatted": "₹80.90 Lac"
}
```

curl example:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "location": "bangalore", "bhk": 3, "floor": 4, "bathroom": 2,
    "balcony": 1, "covered_parking": 1, "open_parking": 0,
    "garden_park": true, "main_road": false, "pool": false,
    "furnishing": "Semi-Furnished", "transaction": "Resale"
  }'
```

Unrecognized `location` values are not rejected — they're mapped to the
model's `"other"` category, the same way rare locations were grouped at
training time.

## 10. Model metrics

Trained on an 80/20 split of the cleaned dataset (175,248 rows after
outlier removal), evaluated on the held-out test set:

| Model | MAE (₹) | RMSE (₹) | R² |
|---|---:|---:|---:|
| Linear Regression | 4,582,485 | 6,840,384 | 0.578 |
| **Random Forest (shipped)** | **1,393,000** | **3,732,276** | **0.874** |
| Random Forest (log-target) | 1,355,652 | 3,902,689 | 0.863 |

5-fold cross-validation of the shipped model on a 20,000-row sample: mean
R² = **0.853** (fold scores 0.847–0.876), confirming the test-set score
isn't a lucky split.

**Why Random Forest:** price depends non-linearly on location, BHK, and
amenities together — Linear Regression underfits badly (R² 0.58), while the
Random Forest captures those interactions directly. The log-target variant
was tested (recommended when a target is this skewed) but didn't beat
training on raw price for this dataset, so the plain Random Forest is what's
shipped.

Full EDA plots (price distribution, price vs. BHK, average price by
location, price by furnishing) are in `notebooks/figures/` and embedded in
the notebook itself.

## 11. Screenshots

Run the frontend locally (`npm run dev`) and the backend (`uvicorn app.main:app --reload`),
then drop screenshots of the home page and result page here:

```
frontend/screenshots/home.png
frontend/screenshots/result.png
```

## 12. Notes & gotchas

- **Version pinning:** the shipped model was trained with
  `scikit-learn==1.8.0`. `backend/requirements.txt` pins the same version —
  a pickled `Pipeline` only loads reliably against a matching scikit-learn
  version.
- **Feature engineering lives in two places by design:** the notebook does
  it during training (`bathroom_num`, `balcony_num`, capped parking
  columns, `location_grouped`, etc.), and
  `backend/app/services/preprocessing.py` mirrors those exact
  transformations at inference time so a single request maps onto the same
  column names and encoding the pipeline was fit on.
- The raw dataset CSV and `node_modules/`/`.venv/`/`.env` are gitignored —
  see `.gitignore`.

---

Built as a student ML project — predictions are a starting point for
negotiation, not a formal appraisal.
