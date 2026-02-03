const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { validateBookingDates } = require("../middleware/validateRequest");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

// All booking routes require authentication
router.post("/", protect, validateBookingDates, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
