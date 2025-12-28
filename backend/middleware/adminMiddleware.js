import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to check if user has admin role
 * Must be used after the protect middleware
 */
export const admin = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }

        if (req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Access denied. Admin privileges required.');
        }

        next();
    } catch (error) {
        res.status(403).json({ message: error.message || 'Access denied' });
    }
};

export default admin;
