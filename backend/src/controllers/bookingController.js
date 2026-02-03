const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/User
const createBooking = async (req, res) => {
  try {
    /* 🔐 BLOCK ADMIN FROM BOOKING */
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins are not allowed to book vehicles",
      });
    }

    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Vehicle, start date and end date are required",
      });
    }

    // 1. Find vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // 2. Availability flag check
    if (vehicle.isAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for booking",
      });
    }

    // 3. Check for date conflicts
    const isAvailable = await Booking.isVehicleAvailable(
      vehicleId,
      new Date(startDate),
      new Date(endDate),
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is already booked for the selected dates",
      });
    }

    // 4. Generate booking reference
    let bookingReference;
    do {
      bookingReference = Booking.generateBookingReference();
    } while (await Booking.exists({ bookingReference }));

    // 5. Create booking
    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      pricePerDay: vehicle.pricePerDay,
      bookingReference,
      status: "pending",
    });

    // 6. Populate response
    await booking.populate([
      { path: "vehicle", select: "name type brand model image pricePerDay" },
      { path: "user", select: "name email phone" },
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: { booking },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private/User
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle", "name type brand model image pricePerDay")
      .populate("paymentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("vehicle", "name type brand model image pricePerDay")
      .populate("user", "name email phone")
      .populate("paymentId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Authorization
    if (
      req.user.role !== "admin" &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private/User
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Ownership check
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed booking",
      });
    }

    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason?.trim() || "User cancelled";
    booking.cancelledAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: { booking },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
