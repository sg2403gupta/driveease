// Middleware to restrict access to admin users only
const adminOnly = (req, res, next) => {
  // Check if user exists (should be set by protect middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Check if user role is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next(); // User is admin, proceed
};

// Middleware to restrict access to regular users only
const userOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "This action is only available to regular users",
    });
  }

  next();
};

module.exports = { adminOnly, userOnly };
