import { FormEvent, useState } from "react";
import { LOCATIONS } from "../data/locations";
import type { Furnishing, PredictionRequest, Transaction } from "../types/prediction";

const FURNISHING_OPTIONS: Furnishing[] = ["Unfurnished", "Semi-Furnished", "Furnished"];
const TRANSACTION_OPTIONS: Transaction[] = ["Resale", "New Property", "Rent/Lease", "Other"];

type FieldErrors = Partial<Record<keyof PredictionRequest, string>>;

interface Props {
  onSubmit: (payload: PredictionRequest) => void;
  submitting: boolean;
}

const INITIAL_STATE: PredictionRequest = {
  location: "",
  bhk: 2,
  floor: 1,
  bathroom: 2,
  balcony: 1,
  covered_parking: 0,
  open_parking: 0,
  garden_park: false,
  main_road: false,
  pool: false,
  furnishing: "Unfurnished",
  transaction: "Resale",
};

export default function PredictionForm({ onSubmit, submitting }: Props) {
  const [form, setForm] = useState<PredictionRequest>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});

  function update<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(values: PredictionRequest): FieldErrors {
    const next: FieldErrors = {};
    if (!values.location) next.location = "Choose the property's city.";
    if (!values.bhk || values.bhk < 1) next.bhk = "Enter at least 1 BHK.";
    if (values.floor < 0) next.floor = "Floor can't be negative.";
    if (values.bathroom < 0) next.bathroom = "Bathrooms can't be negative.";
    if (values.balcony < 0) next.balcony = "Balconies can't be negative.";
    if (values.covered_parking < 0) next.covered_parking = "Can't be negative.";
    if (values.open_parking < 0) next.open_parking = "Can't be negative.";
    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  }

  return (
    <form className="survey-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field field--wide">
          <span className="field-label">
            City <span aria-hidden="true">*</span>
          </span>
          <select
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            aria-invalid={Boolean(errors.location)}
          >
            <option value="" disabled>
              Select a city…
            </option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc
                  .split("-")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
          {errors.location && <span className="field-error">{errors.location}</span>}
        </label>

        <label className="field">
          <span className="field-label">Bedrooms (BHK) *</span>
          <input
            type="number"
            min={1}
            max={20}
            value={form.bhk}
            onChange={(e) => update("bhk", Number(e.target.value))}
            aria-invalid={Boolean(errors.bhk)}
          />
          {errors.bhk && <span className="field-error">{errors.bhk}</span>}
        </label>

        <label className="field">
          <span className="field-label">Floor</span>
          <input
            type="number"
            min={0}
            max={100}
            value={form.floor}
            onChange={(e) => update("floor", Number(e.target.value))}
            aria-invalid={Boolean(errors.floor)}
          />
          {errors.floor && <span className="field-error">{errors.floor}</span>}
        </label>

        <label className="field">
          <span className="field-label">Bathrooms</span>
          <input
            type="number"
            min={0}
            max={20}
            value={form.bathroom}
            onChange={(e) => update("bathroom", Number(e.target.value))}
            aria-invalid={Boolean(errors.bathroom)}
          />
          {errors.bathroom && <span className="field-error">{errors.bathroom}</span>}
        </label>

        <label className="field">
          <span className="field-label">Balconies</span>
          <input
            type="number"
            min={0}
            max={10}
            value={form.balcony}
            onChange={(e) => update("balcony", Number(e.target.value))}
            aria-invalid={Boolean(errors.balcony)}
          />
          {errors.balcony && <span className="field-error">{errors.balcony}</span>}
        </label>

        <label className="field">
          <span className="field-label">Covered parking</span>
          <input
            type="number"
            min={0}
            max={10}
            value={form.covered_parking}
            onChange={(e) => update("covered_parking", Number(e.target.value))}
          />
        </label>

        <label className="field">
          <span className="field-label">Open parking</span>
          <input
            type="number"
            min={0}
            max={10}
            value={form.open_parking}
            onChange={(e) => update("open_parking", Number(e.target.value))}
          />
        </label>

        <label className="field">
          <span className="field-label">Furnishing</span>
          <select
            value={form.furnishing}
            onChange={(e) => update("furnishing", e.target.value as Furnishing)}
          >
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Transaction type</span>
          <select
            value={form.transaction}
            onChange={(e) => update("transaction", e.target.value as Transaction)}
          >
            {TRANSACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <div className="field field--wide">
          <span className="field-label">Amenities</span>
          <div className="toggle-row">
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.garden_park}
                onChange={(e) => update("garden_park", e.target.checked)}
              />
              <span>Garden / park</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.main_road}
                onChange={(e) => update("main_road", e.target.checked)}
              />
              <span>Main road facing</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.pool}
                onChange={(e) => update("pool", e.target.checked)}
              />
              <span>Swimming pool</span>
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Surveying the market…" : "Get estimate"}
      </button>
    </form>
  );
}
