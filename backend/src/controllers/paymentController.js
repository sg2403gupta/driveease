const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// @desc    Process dummy payment
// @route   POST /api/payments/process
// @access  Private/User
const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to pay for this booking",
      });
    }

    // Check if booking is pending
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Payment can only be made for pending bookings",
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });

    if (existingPayment && existingPayment.paymentStatus === "success") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed for this booking",
      });
    }

    // Generate transaction ID
    const transactionId = Payment.generateTransactionId();

    // Simulate payment processing (always success for dummy)
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalPrice,
      paymentMethod: paymentMethod || "dummy",
      paymentStatus: "success",
      transactionId,
      gatewayResponse: {
        message: "Dummy payment processed successfully",
        timestamp: new Date(),
      },
    });

    // Update booking status
    booking.status = "confirmed";
    booking.paymentId = payment._id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: { payment },
    });
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment processing failed",
    });
  }
};

// @desc    Get payment by booking ID
// @route   GET /api/payments/booking/:bookingId
// @access  Private
const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate("booking")
      .populate("user", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this booking",
      });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      payment.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this payment",
      });
    }

    res.status(200).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
    });
  }
};

module.exports = {
  processPayment,
  getPaymentByBooking,
};
