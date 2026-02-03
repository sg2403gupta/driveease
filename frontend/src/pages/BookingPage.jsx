import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { getVehicleById } from "../api/vehicleApi";
import { createBooking } from "../api/bookingApi";
import { processPayment } from "../api/paymentApi";
import BookingForm from "../components/booking/BookingForm";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { capitalizeFirst } from "../utils/helpers";
import { getImageUrl } from "../utils/image";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

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

  const handleBookingSubmit = async (formData) => {
    if (!vehicle.isAvailable) {
      setError("This vehicle is currently unavailable for booking.");
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      const bookingRes = await createBooking(formData);
      const newBooking = bookingRes.data.booking;

      await processPayment({
        bookingId: newBooking._id,
        paymentMethod: "dummy",
      });

      setBookingData(newBooking);
      setBookingSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =========================
     LOADING / ERROR
  ========================== */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <Loader text="Preparing your booking..." />
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchVehicle} />
      </div>
    );
  }

  if (!vehicle) return null;

  /* =========================
     ✅ PAYMENT SUCCESS PAGE
  ========================== */
  if (bookingSuccess && bookingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light px-4 dark:bg-bg-primary-dark">
        <div className="w-full max-w-md rounded-xl bg-bg-surface-light p-8 text-center shadow-lg dark:bg-bg-surface-dark">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />

          <h2 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Payment Successful
          </h2>

          <p className="mb-6 text-sm text-text-muted-light dark:text-text-muted-dark">
            Your booking has been confirmed successfully.
          </p>

          <div className="mb-6 rounded-lg bg-bg-primary-light p-4 text-left text-sm dark:bg-bg-primary-dark">
            <div className="flex justify-between">
              <span className="text-text-muted-light">Booking Ref</span>
              <span className="font-medium">
                {bookingData.bookingReference}
              </span>
            </div>

            <div className="mt-2 flex justify-between">
              <span className="text-text-muted-light">Vehicle</span>
              <span className="font-medium">
                {vehicle.brand} {vehicle.model}
              </span>
            </div>

            <div className="mt-2 flex justify-between">
              <span className="text-text-muted-light">Status</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="rounded-lg bg-accent py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              View My Bookings
            </button>

            <button
              onClick={() => navigate("/vehicles")}
              className="rounded-lg border border-border-light py-2 text-sm font-medium
                         text-text-primary-light dark:border-border-dark dark:text-text-primary-dark"
            >
              Book Another Vehicle
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     BOOKING FORM
  ========================== */
  return (
    <div className="min-h-screen bg-bg-primary-light py-10 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Book Your Ride
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {vehicle.fullName ||
              `${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Vehicle Summary */}
          <div className="rounded-xl bg-bg-surface-light p-6 shadow-md dark:bg-bg-surface-dark">
            <h2 className="mb-4 text-lg font-semibold">Vehicle Details</h2>

            <img
              src={getImageUrl(vehicle.image)}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="mb-4 h-48 w-full rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-vehicle.webp";
              }}
            />

            <div className="space-y-2 text-sm">
              {[
                ["Type", capitalizeFirst(vehicle.type)],
                ["Fuel", capitalizeFirst(vehicle.fuelType)],
                ["Year", vehicle.year],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-black/5 pb-2 dark:border-white/10"
                >
                  <span className="text-text-muted-light dark:text-text-muted-dark">
                    {label}
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-bg-primary-light p-4 text-sm dark:bg-bg-primary-dark">
              <div className="mb-1 flex items-center gap-2 text-accent">
                <Info className="h-4 w-4" />
                About this vehicle
              </div>
              <p className="line-clamp-3 text-text-muted-light dark:text-text-muted-dark">
                {vehicle.description}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="rounded-xl bg-bg-surface-light p-6 shadow-md dark:bg-bg-surface-dark">
            <h2 className="mb-4 text-lg font-semibold">Select Dates</h2>

            {vehicle.isAvailable ? (
              <BookingForm
                vehicle={vehicle}
                onSubmit={handleBookingSubmit}
                isLoading={bookingLoading}
              />
            ) : (
              <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
                This vehicle is currently unavailable.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-accent/30 bg-bg-surface-light px-4 py-3 text-xs dark:bg-bg-surface-dark">
          ⚠️ Demo payment system — bookings are confirmed instantly.
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
