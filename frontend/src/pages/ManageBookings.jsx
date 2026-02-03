import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { getAllBookings, updateBookingStatus } from "../api/bookingApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  capitalizeFirst,
} from "../utils/helpers";
import { BOOKING_STATUS } from "../utils/constants";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const filters = filterStatus ? { status: filterStatus } : {};
      const res = await getAllBookings(filters);
      setBookings(res.data.bookings);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const res = await updateBookingStatus(bookingId, newStatus);
      setBookings(
        bookings.map((b) => (b._id === bookingId ? res.data.booking : b)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <Loader text="Loading bookings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchBookings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary-light py-8 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Manage Bookings
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            View and manage all customer bookings
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <Filter className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-black/10 bg-bg-surface-light px-4 py-2 text-text-primary-light focus:outline-none focus:ring-2 focus:ring-accent dark:border-white/10 dark:bg-bg-surface-dark dark:text-text-primary-dark"
          >
            <option value="">All Statuses</option>
            <option value={BOOKING_STATUS.PENDING}>Pending</option>
            <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
            <option value="completed">Completed</option>
            <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
          </select>

          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Showing {bookings.length} bookings
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-bg-surface-light shadow-md dark:bg-bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent text-white">
                <tr>
                  {[
                    "Booking Ref",
                    "Customer",
                    "Vehicle",
                    "Dates",
                    "Amount",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-text-primary-light dark:text-text-primary-dark">
                      {booking.bookingReference}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {booking.user?.name}
                      </div>
                      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        {booking.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </div>
                      <div className="text-sm capitalize text-text-muted-light dark:text-text-muted-dark">
                        {booking.vehicle?.type}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                      <div>{formatDate(booking.startDate)}</div>
                      <div>{formatDate(booking.endDate)}</div>
                      <div className="text-xs">({booking.totalDays} days)</div>
                    </td>

                    <td className="px-6 py-4 font-medium text-text-muted-light dark:text-text-muted-dark">
                      {formatCurrency(booking.totalPrice)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`${getStatusColor(
                          booking.status,
                        )} rounded-full px-3 py-1 text-xs text-white`}
                      >
                        {capitalizeFirst(booking.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {updatingId === booking._id ? (
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                          Updating...
                        </span>
                      ) : (
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusUpdate(booking._id, e.target.value)
                          }
                          disabled={booking.status === "cancelled"}
                          className="rounded-lg border border-black/10 bg-bg-surface-light px-3 py-1 text-sm text-text-primary-light focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-bg-surface-dark dark:text-text-primary-dark"
                        >
                          <option value={BOOKING_STATUS.PENDING}>
                            Pending
                          </option>
                          <option value={BOOKING_STATUS.CONFIRMED}>
                            Confirmed
                          </option>
                          <option value="completed">Completed</option>
                          <option value={BOOKING_STATUS.CANCELLED}>
                            Cancelled
                          </option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="py-12 text-center text-text-muted-light dark:text-text-muted-dark">
              No bookings found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
