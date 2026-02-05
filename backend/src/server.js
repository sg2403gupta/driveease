require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const { validateEnv, env } = require("./config/env");
const errorHandler = require("./middleware/errorHandler");

// ENV VALIDATION

validateEnv();

const app = express();

// DATABASE
connectDB();

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  /\.vercel\.app$/, // allow ALL Vercel preview + prod domains
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server calls
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) =>
        allowed instanceof RegExp ? allowed.test(origin) : allowed === origin,
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//HANDLE PREFLIGHT REQUESTS
app.options("*", cors());

// BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
// server.js → backend/src
// uploads → backend/uploads
const uploadsPath = path.resolve(__dirname, "../uploads");
console.log("Serving uploads from:", uploadsPath);

app.use("/uploads", express.static(uploadsPath));

// REQUEST LOGGING
if (env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vehicle Rental API is running...",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

// START SERVER
const PORT = env.PORT || process.env.PORT || 10000;

const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`Server running in ${env.NODE_ENV} mode`);
  console.log(`Server listening on port ${PORT}`);
  console.log("=".repeat(50));
});

// PROCESS SAFETY
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
