import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'; // Make sure this is installed
import { notFound, errorHandler } from './backend/middleware/errorMiddleware.js';
import connectDB from './backend/config/db.js';
import supplierRoutes from './backend/routes/supplierRoutes.js';
// import userRoutes from './backend/routes/userRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// --- Core Middleware ---

// Enable CORS. Adjust the origin for production.
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true,
}));

// Set security-related HTTP headers
app.use(helmet());

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies, essential for authentication
app.use(cookieParser());

// HTTP request logger middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- API Routes ---
app.use('/api/suppliers', supplierRoutes);
// app.use('/api/users', userRoutes);

// --- Frontend & Static Asset Serving ---

// --- Error Handling Middleware (should be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)