const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Reference to booking
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
      unique: true, // One payment per booking
    },

    // Reference to user who made payment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    // Payment amount
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Amount must be positive"],
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: {
        values: ["cash", "card", "upi", "netbanking", "dummy"],
        message: "Invalid payment method",
      },
      default: "dummy",
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "success", "failed"],
        message: "Invalid payment status",
      },
      default: "pending",
    },

    // Transaction details
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness when present
    },

    // Payment gateway response (for dummy/test payments)
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Payment timestamps
    paidAt: {
      type: Date,
    },

    failedAt: {
      type: Date,
    },

    failureReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ paymentStatus: 1 });

// Generate unique transaction ID
paymentSchema.statics.generateTransactionId = function () {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
};

// FIXED pre-save hook (NO next, NO async)
paymentSchema.pre("save", function () {
  if (this.isModified("paymentStatus")) {
    if (this.paymentStatus === "success" && !this.paidAt) {
      this.paidAt = new Date();
    }

    if (this.paymentStatus === "failed" && !this.failedAt) {
      this.failedAt = new Date();
    }
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
