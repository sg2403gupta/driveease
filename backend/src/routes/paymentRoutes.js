const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  processPayment,
  getPaymentByBooking,
} = require("../controllers/paymentController");

// All payment routes require authentication
router.post("/process", protect, processPayment);
router.get("/booking/:bookingId", protect, getPaymentByBooking);

module.exports = router;
