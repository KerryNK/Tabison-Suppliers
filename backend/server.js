const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errorMiddleware")

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Tabison Suppliers API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      api: "/api",
      products: "/api/products",
      suppliers: "/api/suppliers",
      auth: "/api/auth",
      cart: "/api/cart",
      orders: "/api/orders",
    },
  })
})

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))
app.use("/api/suppliers", require("./routes/suppliers"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/contact", require("./routes/contact"))

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api/products",
      "GET /api/suppliers",
      "POST /api/auth/login",
      "POST /api/auth/register",
    ],
  })
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
