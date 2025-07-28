const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const { errorHandler, notFound } = require("./middleware/errorMiddleware")

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
app.use("/api/orders", require("./routes/orders"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/contact", require("./routes/contact"))

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

module.exports = app
