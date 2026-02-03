const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token and attach user to request
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login to access this resource.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user still exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists.",
        });
      }

      // Check if user account is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Your account has been deactivated.",
        });
      }

      next(); // Proceed to next middleware/controller
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

module.exports = { protect };
