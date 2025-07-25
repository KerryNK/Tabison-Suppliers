import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import 'express-async-errors'; // Handles async errors in express
import logger from './config/logger.js';
import ErrorHandler from './utils/errorHandler.js';

dotenv.config();

const app = express();

// Route files
import supplierRoutes from './routes/suppliers.js';
import uploadRoutes from './routes/uploadRoutes.js';
// ... import other routes like auth, products, etc.

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// CORS Policy
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : [];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests) and whitelisted origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ErrorHandler('Not allowed by CORS', 403));
    }
  },
  credentials: true, // This is useful if you need to send cookies with requests
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter); // Apply to all api routes

// Mount routers
app.use('/api/suppliers', supplierRoutes);
// ... app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static('uploads'));

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // Only log the full stack in development
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }
  
  res.status(err.statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

export default app;
