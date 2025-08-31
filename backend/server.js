import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Remove "backend/" 
import app from './app.js';              // Remove "backend/"

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);