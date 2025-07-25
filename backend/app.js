import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import logger from './config/logger.js';
import ErrorHandler from './utils/errorHandler.js';

// Route files
import supplierRoutes from './routes/suppliers.js';
import uploadRoutes from './routes/uploadRoutes.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import contactRoutes from './routes/contact.js';
import proxyRoutes from './routes/proxy.js';

dotenv.config();
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// CORS Policy
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ErrorHandler('Not allowed by CORS', 403));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Body Parser & Rate Limiting
app.use(express.json());
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Mount routers
app.use('/api/suppliers', supplierRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/proxy', proxyRoutes);

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (process.env.NODE_ENV === 'development') logger.error(err.stack);
  res.status(err.statusCode).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack });
});

export default app;