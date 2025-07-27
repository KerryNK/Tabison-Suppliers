import app from './backend/app.js';
import connectDB from './backend/config/db.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)