import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Car, Fuel, Calendar, IndianRupee, Check } from "lucide-react";
import { getVehicleById } from "../api/vehicleApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatCurrency, capitalizeFirst } from "../utils/helpers";
import { getImageUrl } from "../utils/image";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ IMPORTANT: get user also
  const { isAuthenticated, user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await getVehicleById(id);
      setVehicle(res.data.vehicle);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch vehicle details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // ❌ BLOCK ADMIN
    if (user?.role === "admin") {
      alert("Admins are not allowed to book vehicles.");
      return;
    }

    navigate(`/booking/${vehicle._id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <Loader text="Loading vehicle details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchVehicle} />
      </div>
    );
  }

  if (!vehicle) return null;

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-bg-primary-light py-10 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-6xl px-4">
        {/* Image */}
        <div className="mb-8 overflow-hidden rounded bg-bg-surface-light dark:bg-bg-surface-dark">
          <img
            src={getImageUrl(vehicle.image)}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-[420px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-vehicle.webp";
            }}
          />
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </h1>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {vehicle.name}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-2xl font-semibold text-accent">
              <IndianRupee className="h-5 w-5" />
              {formatCurrency(vehicle.pricePerDay)}
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              per day
            </p>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8">
          <span
            className={`inline-block rounded px-3 py-1 text-xs font-medium ${
              vehicle.isAvailable
                ? "bg-success text-white"
                : "bg-danger text-white"
            }`}
          >
            {vehicle.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Description */}
        <div className="mb-10 max-w-3xl">
          <h2 className="mb-2 text-lg font-semibold">About this vehicle</h2>
          <p className="leading-relaxed text-text-muted-light dark:text-text-muted-dark">
            {vehicle.description}
          </p>
        </div>

        {/* Specs */}
        <div className="mb-10 grid grid-cols-2 gap-6 border-y border-border-light py-6 dark:border-border-dark md:grid-cols-4">
          <Spec
            icon={<Car />}
            label="Type"
            value={capitalizeFirst(vehicle.type)}
          />
          <Spec
            icon={<Fuel />}
            label="Fuel"
            value={capitalizeFirst(vehicle.fuelType)}
          />
          <Spec icon={<Calendar />} label="Year" value={vehicle.year} />
          {vehicle.seatingCapacity && (
            <Spec
              icon={<span>👥</span>}
              label="Seats"
              value={vehicle.seatingCapacity}
            />
          )}
        </div>

        {/* Features */}
        {vehicle.features?.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold">Features</h2>
            <div className="flex flex-wrap gap-3">
              {vehicle.features.map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 rounded bg-bg-muted-light px-4 py-2 text-sm
                             text-text-muted-light dark:bg-bg-muted-dark dark:text-text-muted-dark"
                >
                  <Check className="h-4 w-4 text-accent" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-md">
          {vehicle.isAvailable && !isAdmin ? (
            <button
              onClick={handleBookNow}
              className="w-full rounded bg-accent py-3 text-sm font-semibold uppercase tracking-wide
                         text-white transition hover:bg-accent-hover"
            >
              {isAuthenticated ? "Book Vehicle" : "Login to Book"}
            </button>
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded bg-border-light py-3 text-sm font-semibold text-text-muted-light"
            >
              {isAdmin
                ? "Admins cannot book vehicles"
                : "Currently Unavailable"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Spec = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
      {icon}
    </div>
    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
      {label}
    </p>
    <p className="text-sm font-semibold">{value}</p>
  </div>
);

export default VehicleDetails;
