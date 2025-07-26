import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes that require authentication.
 * It verifies the JWT from the cookie and attaches the user to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user object to the request, excluding the password
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

/**
 * Middleware to authorize users based on their role.
 * Must be used *after* the protect middleware.
 * @param {...string} roles - The roles allowed to access the route.
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user.role}' is not authorized to access this route`);
  }
  next();
};