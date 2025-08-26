import { logSecurityEvent } from '../config/logger.js';
import rateLimit from 'express-rate-limit';

// Track failed login attempts
const loginAttempts = new Map();

// Function to check for suspicious patterns
const isSuspiciousRequest = (req) => {
  const suspiciousPatterns = [
    /\.\.[\/\\]/,  // Directory traversal
    /<script>/i,   // XSS attempts
    /union\s+select/i,  // SQL injection
    /eval\(/i,     // JavaScript injection
  ];

  const checkString = [
    req.path,
    JSON.stringify(req.query),
    JSON.stringify(req.body),
    req.headers['user-agent'] || ''
  ].join(' ');

  return suspiciousPatterns.some(pattern => pattern.test(checkString));
};

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      ip: req.ip,
      path: '/api/auth/login',
      attempts: 5
    });
    res.status(429).json({
      message: 'Too many login attempts, please try again after 15 minutes'
    });
  }
});

// Track failed login attempts
export const trackLoginAttempts = (req, res, next) => {
  const ip = req.ip;
  
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 0, timestamp: Date.now() });
  }

  const attempt = loginAttempts.get(ip);
  
  // Reset attempts after 15 minutes
  if (Date.now() - attempt.timestamp > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 0, timestamp: Date.now() });
  }
  
  next();
};

// Monitor for suspicious activity
export const securityMonitor = (req, res, next) => {
  // Check for suspicious patterns
  if (isSuspiciousRequest(req)) {
    logSecurityEvent({
      type: 'SUSPICIOUS_REQUEST',
      ip: req.ip,
      path: req.path,
      method: req.method,
      query: req.query,
      body: req.body,
      headers: req.headers
    });
  }

  // Monitor payload size
  const contentLength = parseInt(req.headers['content-length'] || 0);
  if (contentLength > 10 * 1024 * 1024) { // 10MB
    logSecurityEvent({
      type: 'LARGE_PAYLOAD',
      ip: req.ip,
      path: req.path,
      size: contentLength
    });
  }

  // Monitor unusual request patterns
  if (req.headers['accept'] === undefined || req.headers['user-agent'] === undefined) {
    logSecurityEvent({
      type: 'MISSING_HEADERS',
      ip: req.ip,
      path: req.path,
      headers: req.headers
    });
  }

  next();
};

// Clean up old login attempts periodically
setInterval(() => {
  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
  for (const [ip, attempt] of loginAttempts.entries()) {
    if (attempt.timestamp < fifteenMinutesAgo) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
