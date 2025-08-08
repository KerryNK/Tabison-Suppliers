import express from 'express';
import 'express-async-errors'; // Handles async errors in controllers
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';

// Import Error Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// Import Routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import productRoutes from './routes/products.js';
import supplierRoutes from './routes/supplierRoutes.js';
import proxyRoutes from './routes/proxy.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlist.js';
import quoteRoutes from './routes/quotes.js';
import otpRoutes from './routes/otp.js';
import deliveryRoutes from './routes/delivery.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Global Middleware ---

// Set security HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing with credentials support
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies from incoming requests

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

// Serve static files (e.g., for uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/delivery', deliveryRoutes);

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  // Define the path to the frontend build directory
  const frontendBuildPath = path.resolve(__dirname, '../frontend/build');

  // Serve static files from the React app build directory
  app.use(express.static(frontendBuildPath));

  // For any other GET request that doesn't match an API route,
  // send back the React app's index.html file.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Welcome to Tabison Suppliers API');
  });
}

// --- Use Error Handling Middleware (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;