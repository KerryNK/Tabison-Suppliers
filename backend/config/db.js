import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is set in your .env file
    if (!process.env.MONGO_URI) {
      logger.error('MONGO_URI is not defined in the environment variables.');
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`DB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }

  mongoose.connection.on('error', err => {
    logger.error(`Mongoose runtime connection error: ${err}`);
  });
};

export default connectDB;