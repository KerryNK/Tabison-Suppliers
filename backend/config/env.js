import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Environment configuration
const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database Configuration
  MONGO_URI:
    process.env.MONGO_URI || "mongodb+srv://kerrym:W2DDlHaNZtvbg45u@cluster0.qjjen.mongodb.net/tabison-suppliers",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || "https://tabisonsuppliers.vercel.app",

  // External API
  EXTERNAL_API_URL: process.env.EXTERNAL_API_KEY || "https://suppliers-7zjy.onrender.com",

  // Email Configuration
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@tabisonsuppliers.com",
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // Payment - M-Pesa
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
  MPESA_PASSKEY: process.env.MPESA_PASSKEY,
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE,
  MPESA_ENVIRONMENT: process.env.MPESA_ENVIRONMENT || "sandbox",

  // Payment - Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,

  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || "5mb",
  UPLOAD_PATH: process.env.UPLOAD_PATH || "./uploads",

  // Security Configuration
  BCRYPT_ROUNDS: Number.parseInt(process.env.BCRYPT_ROUNDS) || 12,
  RATE_LIMIT_WINDOW: Number.parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: Number.parseInt(process.env.RATE_LIMIT_MAX) || 100,

  // Pagination
  DEFAULT_PAGE_SIZE: Number.parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
  MAX_PAGE_SIZE: Number.parseInt(process.env.MAX_PAGE_SIZE) || 100,

  // Cache Configuration
  CACHE_TTL: Number.parseInt(process.env.CACHE_TTL) || 300, // 5 minutes

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // Development flags
  ENABLE_CORS: process.env.ENABLE_CORS !== "false",
  ENABLE_LOGGING: process.env.ENABLE_LOGGING !== "false",
  ENABLE_COMPRESSION: process.env.ENABLE_COMPRESSION !== "false",
}

// Validation
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "EMAIL_USER", "EMAIL_PASS"]

const missingEnvVars = requiredEnvVars.filter((envVar) => !config[envVar])

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingEnvVars)
  if (config.NODE_ENV === "production") {
    process.exit(1)
  }
}

// Log configuration in development
if (config.NODE_ENV === "development") {
  console.log("🔧 Environment Configuration:")
  console.log(`   NODE_ENV: ${config.NODE_ENV}`)
  console.log(`   PORT: ${config.PORT}`)
  console.log(`   MONGO_URI: ${config.MONGO_URI ? "✅ Set" : "❌ Missing"}`)
  console.log(`   JWT_SECRET: ${config.JWT_SECRET ? "✅ Set" : "❌ Missing"}`)
  console.log(`   FRONTEND_URL: ${config.FRONTEND_URL}`)
  console.log(`   EXTERNAL_API_URL: ${config.EXTERNAL_API_URL}`)
}

export default config
