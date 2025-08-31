// backend/config/config.js
export default {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'fallback-secret',
  corsOrigins: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://tabisonsuppliers.vercel.app',
    'https://suppliers-7zjy.onrender.com'
  ]
};