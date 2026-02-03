const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    // VEHICLE INFO
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
      maxlength: [100, "Vehicle name cannot exceed 100 characters"],
    },

    type: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: {
        values: ["car", "bike", "scooty"],
        message: "Type must be either car, bike, or scooty",
      },
      lowercase: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },

    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Manufacturing year is required"],
      min: [2000, "Year must be 2000 or later"],
      max: [new Date().getFullYear() + 1, "Invalid year"],
    },

    //  DESCRIPTION
    description: {
      type: String,
      required: [true, "Vehicle description is required"],
      trim: true,
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // PRICING & FUEL
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [100, "Price must be at least ₹100"],
      max: [50000, "Price cannot exceed ₹50,000"],
    },

    fuelType: {
      type: String,
      required: [true, "Fuel type is required"],
      enum: {
        values: ["petrol", "diesel", "electric", "hybrid"],
        message: "Invalid fuel type",
      },
      lowercase: true,
    },

    // VEHICLE MEDIA
    image: {
      type: String,
      required: [true, "Vehicle image URL is required"],
      trim: true,
    },

    // CAR-SPECIFIC FIELD
    seatingCapacity: {
      type: Number,
      required: function () {
        return this.type === "car";
      },
      min: [2, "Seating capacity must be at least 2"],
      max: [8, "Seating capacity cannot exceed 8"],
    },

    // FEATURES
    features: {
      type: [String],
      default: [],
    },

    //  AVAILABILITY
    isAvailable: {
      type: Boolean,
      default: true,
    },

    //  ADMIN REFERENCE
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin reference is required"],
    },
  },
  {
    timestamps: true,
  },
);

// INDEXES
vehicleSchema.index({ type: 1, isAvailable: 1 });
vehicleSchema.index({ brand: 1, model: 1 });

// VIRTUALS
vehicleSchema.virtual("fullName").get(function () {
  return `${this.brand} ${this.model} (${this.year})`;
});

vehicleSchema.set("toJSON", { virtuals: true });
vehicleSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
