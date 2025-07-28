const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const { errorHandler } = require("./middlewares/errorMiddleware")

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://tabisonsuppliers.vercel.app",
      "https://suppliers-7zjy.onrender.com",
    ],
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tabison Suppliers API is running",
    version: "1.0.0",
    status: "active",
    endpoints: {
      health: "/health",
      api: "/api",
      products: "/api/products",
      suppliers: "/api/suppliers",
      auth: "/api/auth",
      cart: "/api/cart",
      orders: "/api/orders",
      contact: "/api/contact",
    },
    timestamp: new Date().toISOString(),
  })
})

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: "connected",
  })
})

// Import and use routes
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/products")
const supplierRoutes = require("./routes/suppliers")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/orders")
const contactRoutes = require("./routes/contact")

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/suppliers", supplierRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/contact", contactRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

module.exports = app
