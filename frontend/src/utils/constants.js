/* ===============================
   API CONFIG
================================ */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ===============================
   VEHICLE DOMAIN CONSTANTS
================================ */
export const VEHICLE_TYPES = {
  CAR: "car",
  BIKE: "bike",
  SCOOTY: "scooty",
};

export const VEHICLE_TYPE_LABELS = {
  car: "Car",
  bike: "Bike",
  scooty: "Scooty",
};

/* ===============================
   FUEL TYPES
================================ */
export const FUEL_TYPES = {
  PETROL: "petrol",
  DIESEL: "diesel",
  ELECTRIC: "electric",
  HYBRID: "hybrid",
};

export const FUEL_TYPE_LABELS = {
  petrol: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
};

/* ===============================
   BOOKING & PAYMENT
================================ */
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

/* ===============================
   USER ROLES
================================ */
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

/* ===============================
   UI HELPERS (NON-COLOR)
================================ */
export const DATE_FORMAT = "dd MMM yyyy";

export const PRICE_UNIT = "₹ / day";
