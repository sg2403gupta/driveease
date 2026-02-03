import React, { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { getMinDate, calculateDays, formatCurrency } from "../../utils/helpers";
import { validateBookingDates } from "../../utils/validators";

const BookingForm = ({ vehicle, onSubmit, isLoading }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      const validation = validateBookingDates(startDate, endDate);

      if (!validation.valid) {
        setError(validation.message);
        setTotalDays(0);
        setTotalPrice(0);
        return;
      }

      setError("");
      const days = calculateDays(startDate, endDate);
      setTotalDays(days);
      setTotalPrice(days * vehicle.pricePerDay);
    } else {
      setError("");
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, vehicle.pricePerDay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;

    onSubmit({
      vehicleId: vehicle._id,
      startDate,
      endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Start Date */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          Start date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={getMinDate()}
            required
            className="w-full rounded-lg border border-border-light bg-bg-surface-light
                       py-2.5 pl-10 pr-4 text-sm text-text-primary-light
                       focus:outline-none focus:ring-2 focus:ring-accent
                       dark:border-border-dark dark:bg-bg-surface-dark dark:text-text-primary-dark"
          />
        </div>
      </div>

      {/* End Date */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          End date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || getMinDate()}
            required
            className="w-full rounded-lg border border-border-light bg-bg-surface-light
                       py-2.5 pl-10 pr-4 text-sm text-text-primary-light
                       focus:outline-none focus:ring-2 focus:ring-accent
                       dark:border-border-dark dark:bg-bg-surface-dark dark:text-text-primary-dark"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Price Summary */}
      {totalDays > 0 && !error && (
        <div className="rounded-xl border border-border-light bg-bg-primary-light p-4 text-sm dark:border-border-dark dark:bg-bg-primary-dark">
          <div className="flex justify-between text-text-muted-light dark:text-text-muted-dark">
            <span>Duration</span>
            <span className="font-medium">{totalDays} days</span>
          </div>

          <div className="mt-1 flex justify-between text-text-muted-light dark:text-text-muted-dark">
            <span>Price per day</span>
            <span className="font-medium">
              {formatCurrency(vehicle.pricePerDay)}
            </span>
          </div>

          <div className="mt-3 flex justify-between border-t border-black/10 pt-3 text-base font-semibold text-accent dark:border-white/10">
            <span>Total amount</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !startDate || !endDate || !!error}
        className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition
                   hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Processing booking..." : "Proceed to Payment"}
      </button>
    </form>
  );
};

export default BookingForm;
