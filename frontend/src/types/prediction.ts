export type Furnishing = "Furnished" | "Semi-Furnished" | "Unfurnished";
export type Transaction = "New Property" | "Resale" | "Other" | "Rent/Lease";

export interface PredictionRequest {
  location: string;
  bhk: number;
  floor: number;
  bathroom: number;
  balcony: number;
  covered_parking: number;
  open_parking: number;
  garden_park: boolean;
  main_road: boolean;
  pool: boolean;
  furnishing: Furnishing;
  transaction: Transaction;
}

export interface PredictionResponse {
  predicted_price: number;
  predicted_price_formatted: string;
}

export interface ApiError {
  detail: string;
}
