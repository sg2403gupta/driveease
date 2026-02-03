import React, { useState, useEffect } from "react";
import { VEHICLE_TYPES, FUEL_TYPES } from "../../utils/constants";
import { capitalizeFirst } from "../../utils/helpers";

const VehicleForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: "",
    fuelType: "",
    image: "", // 👈 relative path only
    seatingCapacity: "",
    features: "",
    isAvailable: true,
  });

  /* Populate form if editing */
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        year: initialData.year || new Date().getFullYear(),
        pricePerDay: initialData.pricePerDay || "",
        fuelType: initialData.fuelType || "",
        image: initialData.image || "",
        seatingCapacity: initialData.seatingCapacity || "",
        features: initialData.features?.join(", ") || "",
        isAvailable:
          initialData.isAvailable !== undefined
            ? initialData.isAvailable
            : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      year: Number(formData.year),
      pricePerDay: Number(formData.pricePerDay),
      seatingCapacity: formData.seatingCapacity
        ? Number(formData.seatingCapacity)
        : undefined,
      features: formData.features
        ? formData.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <Input label="Vehicle Name *">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </Input>

        {/* Type */}
        <Input label="Type *">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select type</option>
            {Object.values(VEHICLE_TYPES).map((t) => (
              <option key={t} value={t}>
                {capitalizeFirst(t)}
              </option>
            ))}
          </select>
        </Input>

        {/* Brand */}
        <Input label="Brand *">
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="input"
          />
        </Input>

        {/* Model */}
        <Input label="Model *">
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="input"
          />
        </Input>

        {/* Year */}
        <Input label="Year *">
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max={new Date().getFullYear() + 1}
            required
            className="input"
          />
        </Input>

        {/* Price */}
        <Input label="Price per day (₹) *">
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            min="100"
            required
            className="input"
          />
        </Input>

        {/* Fuel */}
        <Input label="Fuel Type *">
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select fuel</option>
            {Object.values(FUEL_TYPES).map((f) => (
              <option key={f} value={f}>
                {capitalizeFirst(f)}
              </option>
            ))}
          </select>
        </Input>

        {/* Seats */}
        <Input label={`Seating Capacity ${formData.type === "car" ? "*" : ""}`}>
          <input
            type="number"
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleChange}
            required={formData.type === "car"}
            min="1"
            max="8"
            className="input"
          />
        </Input>
      </div>

      {/* IMAGE PATH (IMPORTANT FIX) */}
      <Input label="Image path (relative to /uploads) *">
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="vehicles/cars/car-honda-city.webp"
          className="input"
        />
        <p className="mt-1 text-xs text-gray-500">
          Example: <code>vehicles/cars/car-honda-city.webp</code>
        </p>
      </Input>

      {/* Features */}
      <Input label="Features (comma-separated)">
        <input
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="AC, GPS, Bluetooth"
          className="input"
        />
      </Input>

      {/* Availability */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        Available for booking
      </label>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : initialData
              ? "Update Vehicle"
              : "Add Vehicle"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

/* Small helper */
const Input = ({ label, children }) => (
  <div>
    <label className="mb-1 block text-sm font-medium">{label}</label>
    {children}
  </div>
);

export default VehicleForm;
