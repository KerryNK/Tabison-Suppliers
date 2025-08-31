import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log directory
const logDir = path.join(__dirname, '../logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m'
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m'
    }),
    // Write security events to a separate file
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'security-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d', // Keep security logs longer
      maxSize: '20m',
      level: 'warn'
    })
  ]
});

// If we're not in production, log to the console with color
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Function to log security events
export const logSecurityEvent = (event) => {
  // Ensure we have the required fields
  const requiredFields = ['type', 'ip'];
  for (const field of requiredFields) {
    if (!event[field]) {
      logger.error(`Missing required field ${field} in security event`);
      return;
    }
  }

  // Add timestamp and environment
  const enrichedEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  // Log based on severity
  switch (event.type) {
    case 'RATE_LIMIT_EXCEEDED':
    case 'LARGE_PAYLOAD':
    case 'MISSING_HEADERS':
      logger.warn('Security Warning', enrichedEvent);
      break;
    case 'SUSPICIOUS_REQUEST':
    case 'BRUTE_FORCE_ATTEMPT':
      logger.error('Security Alert', enrichedEvent);
      break;
    default:
      logger.info('Security Event', enrichedEvent);
  }
};

// Security event logging
const logSecurityEvent = (event) => {
  logger.warn('Security Event:', {
    ...event,
    timestamp: new Date().toISOString()
  });
};

// Log uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Give the logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
});

export { logger, logSecurityEvent };
export default logger;
