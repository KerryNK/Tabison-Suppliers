import express from "express"
import "express-async-errors" // Handles async errors in controllers
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { rateLimit } from "express-rate-limit"
import compression from "compression"
import mongoSanitize from "express-mongo-sanitize"

// Import Error Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
// Import Routes
import authRoutes from "./routes/auth.js"
import contactRoutes from "./routes/contact.js"
import orderRoutes from "./routes/orders.js"
import paymentRoutes from "./routes/payments.js"
import productRoutes from "./routes/products.js"
import supplierRoutes from "./routes/suppliers.js"
import proxyRoutes from "./routes/proxy.js"
import cartRoutes from "./routes/cart.js"

// Load environment variables from .env file
dotenv.config()

// Set MongoDB URI
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://kerrym:W2DDlHaNZtvbg45u@cluster0.qjjen.mongodb.net/tabison-suppliers"

// Initialize Express app
const app = express()

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- Global Middleware ---

// Set security HTTP headers
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

app.use(cors(corsOptions)) // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: "10mb" })) // To parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })) // Parse URL-encoded bodies
app.use(cookieParser()) // To parse cookies from incoming requests

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Compression middleware
app.use(compression())

// Logger: Use morgan for request logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api", limiter) // Apply to all API routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Serve static files (e.g., for uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// --- API Routes ---
app.use("/api/auth", authRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/products", productRoutes)
app.use("/api/suppliers", supplierRoutes)
app.use("/api/proxy", proxyRoutes)
app.use("/api/cart", cartRoutes)

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === "production") {
  // Define the path to the frontend build directory
  const frontendBuildPath = path.resolve(__dirname, "../frontend/build")

  // Serve static files from the React app build directory
  app.use(express.static(frontendBuildPath))

  // For any other GET request that doesn't match an API route,
  // send back the React app's index.html file.
  app.get("*", (req, res) => res.sendFile(path.resolve(frontendBuildPath, "index.html")))
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to Tabison Suppliers API",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        suppliers: "/api/suppliers",
        products: "/api/products",
        cart: "/api/cart",
        orders: "/api/orders",
        contact: "/api/contact",
      },
    })
  })
}

// --- Use Error Handling Middleware (must be last) ---
app.use(notFound)
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...")
  process.exit(0)
})

export default app
