const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const compression = require("compression")
const morgan = require("morgan")
const path = require("path") // Declare the path variable
require("dotenv").config()

const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorMiddleware")
const logger = require("./config/logger")

// Import routes
const authRoutes = require("./routes/auth")
const supplierRoutes = require("./routes/suppliers")
const productRoutes = require("./routes/products")
const contactRoutes = require("./routes/contact")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/orders")

const app = express()

// Connect to database
connectDB()

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.vercel.com"],
      },
    },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api/", limiter)

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://tabisonsuppliers.vercel.app",
    "https://suppliers-7zjy.onrender.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
}

app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Data sanitization
app.use(mongoSanitize())

// Compression middleware
app.use(compression())

// Logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))
} else {
  app.use(morgan("dev"))
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/suppliers", supplierRoutes)
app.use("/api/products", productRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  })
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Global error handler
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...")
  process.exit(0)
})

module.exports = app
