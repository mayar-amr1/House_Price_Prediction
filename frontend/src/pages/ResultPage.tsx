import { Link, useLocation, useNavigate } from "react-router-dom";
import CornerMarks from "../components/CornerMarks";
import type { PredictionRequest, PredictionResponse } from "../types/prediction";

interface LocationState {
  payload: PredictionRequest;
  result: PredictionResponse;
}

function titleCase(value: string): string {
  return value
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (!state) {
    return (
      <div className="empty-state">
        <CornerMarks />
        <span className="eyebrow">No estimate on file</span>
        <h2>We don't have a valuation to show yet</h2>
        <p>Fill in a property's details first and we'll plot an estimate.</p>
        <Link className="btn-primary" to="/">
          Start a valuation
        </Link>
      </div>
    );
  }

  const { payload, result } = state;

  const facts: [string, string][] = [
    ["City", titleCase(payload.location)],
    ["Configuration", `${payload.bhk} BHK`],
    ["Floor", String(payload.floor)],
    ["Bathrooms", String(payload.bathroom)],
    ["Balconies", String(payload.balcony)],
    ["Furnishing", payload.furnishing],
    ["Transaction", payload.transaction],
    [
      "Parking",
      `${payload.covered_parking} covered · ${payload.open_parking} open`,
    ],
  ];

  const amenities = [
    payload.garden_park && "Garden / park",
    payload.main_road && "Main road facing",
    payload.pool && "Swimming pool",
  ].filter(Boolean) as string[];

  return (
    <div className="result">
      <section className="plaque">
        <CornerMarks />
        <span className="eyebrow">Estimated market value</span>
        <div className="plaque-price">{result.predicted_price_formatted}</div>
        <div className="plaque-underline" aria-hidden="true" />
        <p className="plaque-caption">
          Based on {titleCase(payload.location)} listings with a similar
          profile.
        </p>
      </section>

      <section className="fact-sheet">
        <h3>Property particulars</h3>
        <dl className="fact-grid">
          {facts.map(([label, value]) => (
            <div className="fact" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {amenities.length > 0 && (
          <>
            <h4>Amenities</h4>
            <ul className="amenity-list">
              {amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
        <div className="fact-sheet__actions">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Adjust details
          </button>
          <Link className="btn-primary" to="/">
            Value another property
          </Link>
        </div>
      </section>
    </div>
  );
}
