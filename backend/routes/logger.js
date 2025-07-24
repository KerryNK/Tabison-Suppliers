import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;