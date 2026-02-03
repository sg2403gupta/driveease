// Simple validation middleware for common fields
const validateBookingDates = (req, res, next) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Start date and end date are required",
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  // Check if start date is in the past
  if (start < today) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past",
    });
  }

  // Check if end date is after start date
  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date",
    });
  }

  next();
};

module.exports = { validateBookingDates };
