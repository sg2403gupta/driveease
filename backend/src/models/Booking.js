const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Reference to user who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    // Reference to vehicle being booked
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle is required"],
      index: true,
    },

    // Booking dates
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be on or after start date",
      },
    },

    // Calculated total days (derived field)
    totalDays: {
      type: Number,
      min: [1, "Booking must be for at least 1 day"],
    },

    // Pricing details
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [0, "Price per day must be positive"],
    },

    // Derived total price
    totalPrice: {
      type: Number,
      min: [0, "Total price must be positive"],
    },

    // Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },

    // Cancellation info
    cancellationReason: {
      type: String,
      trim: true,
    },

    cancelledAt: {
      type: Date,
    },

    // Payment reference
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    // Booking reference number (user-visible)
    bookingReference: {
      type: String,
      unique: true,
      required: [true, "Booking reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for availability checks
bookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1 });

// User bookings sorted by latest
bookingSchema.index({ user: 1, createdAt: -1 });

// 🔒 PRE-SAVE HOOK (NO async, NO next)
bookingSchema.pre("save", function () {
  // Calculate total days when dates change
  if (this.isModified("startDate") || this.isModified("endDate")) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    this.totalDays = Math.max(diffDays, 1);
  }

  // Calculate total price when inputs change
  if (this.isModified("totalDays") || this.isModified("pricePerDay")) {
    this.totalPrice = this.totalDays * this.pricePerDay;
  }
});

// Check if vehicle is available for given dates
bookingSchema.statics.isVehicleAvailable = async function (
  vehicleId,
  startDate,
  endDate,
  excludeBookingId = null,
) {
  const query = {
    vehicle: vehicleId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await this.exists(query);
  return !conflict;
};

// Generate unique booking reference
bookingSchema.statics.generateBookingReference = function () {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK${timestamp}${random}`;
};

module.exports = mongoose.model("Booking", bookingSchema);
