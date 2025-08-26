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
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payments.js'
import productRoutes from './routes/products.js'
import supplierRoutes from './routes/supplierRoutes.js'
import proxyRoutes from './routes/proxy.js'
import cartRoutes from './routes/cartRoutes.js'
import wishlistRoutes from './routes/wishlist.js'
import quoteRoutes from './routes/quotes.js'
import otpRoutes from './routes/otp.js'
import deliveryRoutes from './routes/delivery.js'

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

// Import Security Monitor
import { securityMonitor, loginLimiter, trackLoginAttempts } from './middleware/securityMonitor.js';

// Apply security monitoring
app.use(securityMonitor);

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "blob:", "https://*.cloudinary.com"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://*.google.com",
          "https://*.googleapis.com",
          "https://*.cloudflare.com"
        ],
        connectSrc: [
          "'self'",
          "https://api.vercel.com",
          "https://*.mongodb.net",
          "https://*.cloudinary.com",
          process.env.FRONTEND_URL,
          "https://api.mpesa.com"
        ],
        frameSrc: ["'self'", "https://*.google.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://tabisonsuppliers.vercel.app',
    'https://suppliers-7zjy.onrender.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
// Configure cookie parser with secure options
app.use(cookieParser(process.env.JWT_SECRET))

// Configure secure session settings
app.use(session({
  secret: process.env.JWT_SECRET,
  name: 'sessionId', // Change default cookie name
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.tabisonsuppliers.com' : undefined
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // time period in seconds
  })
}))
app.use(mongoSanitize())
app.use(compression())

// Logger: Use morgan for request logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Rate limiting to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter)

// Apply stricter rate limiting to authentication routes
app.use('/api/auth/login', loginLimiter)
app.use('/api/auth/register', loginLimiter)
app.use('/api/auth', trackLoginAttempts)

// Security headers for production
if (process.env.NODE_ENV === 'production') {
  // Enable HSTS
  app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    next()
  })

  // Prevent clickjacking
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    next()
  })

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    next()
  })
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

// Serve static files (e.g., for uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// --- API Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/products', productRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/proxy', proxyRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/otp', otpRoutes)
app.use('/api/delivery', deliveryRoutes)

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
