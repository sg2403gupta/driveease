// Validate and export environment variables
const validateEnv = () => {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:");
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error(
      "\nPlease check your .env file and ensure all required variables are set.",
    );
    process.exit(1);
  }

  console.log("All required environment variables are set");
};

// Export validated environment variables
const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
};

module.exports = { validateEnv, env };
