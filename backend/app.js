import express from 'express';
import 'express-async-errors'; // Handles async errors in controllers
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

// Import Routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import productRoutes from './routes/products.js';
import supplierRoutes from './routes/suppliers.js';
import proxyRoutes from './routes/proxy.js';

// --- Error Handling Middleware ---

/**
 * Handles requests to routes that do not exist.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * The main error handling middleware that catches all errors.
 * It provides a consistent JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  // Use the error's status code or default to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Specific check for Mongoose's CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    // Include stack trace only in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// --- Global Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies

// Logger: Use morgan for request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting to prevent abuse
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 200, // Limit each IP to 200 requests per window
});
app.use('/api', limiter); // Apply to all API routes

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/proxy', proxyRoutes);

// --- Use Error Handling Middleware (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;