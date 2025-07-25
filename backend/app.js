import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors'; // Handles async errors in express
import logger from './config/logger.js';

const app = express();
const port = process.env.PORT || 5000;

// Route files
import supplierRoutes from './routes/suppliers.js';
// ... import other routes like auth, products, etc.

const app = express();


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// CORS Policy
const whitelist = ['http://localhost:3000', 'https://your-production-frontend.com']; // Add your frontend URL
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
import supplierRoutes from './routes/suppliers.js';
app.use('/api/suppliers', supplierRoutes); // Use the imported routes

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});
