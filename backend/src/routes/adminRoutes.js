const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
} = require("../controllers/adminController");

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);
router.get("/stats", getDashboardStats);

module.exports = router;
