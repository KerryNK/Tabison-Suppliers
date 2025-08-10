import productRoutes from './routes/product.js';
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
app.use('/api/products', productRoutes);

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Allowed origins for CORS - update with your frontend URLs
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tabisonsuppliers.vercel.app",
  "https://suppliers-7zjy.onrender.com", // if backend calls backend or for testing
];

// Configure CORS middleware with dynamic origin checking
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable cookies and authentication headers
  })
);

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root route - basic API info
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
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: "connected",
  });
});

// Import route modules
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const supplierRoutes = require("./routes/suppliers");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const contactRoutes = require("./routes/contact");

// Mount route modules
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Custom error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

import express from 'express';
import connectDB from './config/db.js';

const app = express();

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log('🚀 Server running on port 5000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB, exiting...');
    process.exit(1);
  });

module.exports = app;
