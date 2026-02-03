import React from "react";
import { Calendar, IndianRupee, XCircle } from "lucide-react";
import { capitalizeFirst } from "../../utils/helpers";
import { getImageUrl } from "../../utils/image";

const BookingCard = ({ booking, onCancel }) => {
  const vehicle = booking.vehicle;

  return (
    <div className="overflow-hidden rounded-xl bg-bg-surface-light shadow-md transition hover:shadow-lg dark:bg-bg-surface-dark">
      {/* IMAGE */}
      <img
        src={getImageUrl(vehicle?.image)}
        alt={`${vehicle?.brand} ${vehicle?.model}`}
        className="h-40 w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder-vehicle.webp";
        }}
      />

      {/* CONTENT */}
      <div className="p-4">
        {/* TITLE */}
        <h3 className="mb-1 text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
          {vehicle?.brand} {vehicle?.model}
          <span className="ml-1 text-xs text-text-muted-light dark:text-text-muted-dark">
            ({vehicle?.year})
          </span>
        </h3>

        {/* STATUS */}
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            booking.status === "cancelled"
              ? "bg-danger text-white"
              : "bg-success text-white"
          }`}
        >
          {capitalizeFirst(booking.status)}
        </span>

        {/* DETAILS */}
        <div className="mt-3 space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(booking.startDate).toLocaleDateString()} →{" "}
            {new Date(booking.endDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2 font-semibold text-accent">
            <IndianRupee className="h-4 w-4" />
            {booking.totalPrice}
          </div>
        </div>

        {/* ACTION */}
        {booking.status !== "cancelled" && onCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg
                       bg-danger py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <XCircle className="h-4 w-4" />
            Cancel Booking
          </button>
        )}

        {booking.status === "cancelled" && booking.cancellationReason && (
          <p className="mt-3 text-xs text-text-muted-light dark:text-text-muted-dark">
            Reason: {booking.cancellationReason}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
