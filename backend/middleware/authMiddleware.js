import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return next(new ErrorHandler('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new ErrorHandler('Not authorized, no token', 401));
  }
};

// Grant access to specific roles
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorHandler(`User role ${req.user.role} is not authorized to access this route`, 403));
  }
  next();
};