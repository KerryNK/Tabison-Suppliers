import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js'; // Import the configured Express app
import logger from './config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  logger.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => logger.info('MongoDB Connected...'))
  .catch((err) => {
    logger.error('MongoDB connection error:', err.message);
    server.close(() => process.exit(1));
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});