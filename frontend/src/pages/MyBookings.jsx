import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import { getMyBookings, cancelBooking } from "../api/bookingApi";
import BookingCard from "../components/booking/BookingCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data.bookings);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId, "Cancelled by user");

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "cancelled",
                cancellationReason: "Cancelled by user",
              }
            : booking,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <Loader text="Loading your bookings..." />
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchBookings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary-light py-10 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            My Bookings
          </h1>
          <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
            View and manage your vehicle bookings
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-bg-surface-light p-10 text-center shadow-sm dark:bg-bg-surface-dark">
            <PackageOpen className="mb-4 h-14 w-14 text-text-muted-light dark:text-text-muted-dark" />
            <h2 className="mb-2 text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              No bookings yet
            </h2>
            <p className="mb-6 max-w-sm text-sm text-text-muted-light dark:text-text-muted-dark">
              You haven’t booked any vehicles yet. Browse available vehicles and
              make your first booking.
            </p>
            <Link
              to="/vehicles"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={
                  cancellingId === booking._id ? null : handleCancelBooking
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
