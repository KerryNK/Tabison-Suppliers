import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors from express-validator
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

export const supplierRegistrationValidator = [
  // Basic Information
  body('name', 'Company name is required').notEmpty().trim(),
  body('email', 'A valid email is required').isEmail().normalizeEmail(),
  body('phone', 'A valid phone number is required').isMobilePhone('any'),
  body('website', 'Invalid URL format').optional({ checkFalsy: true }).isURL(),

  // Business Details
  body('businessType', 'Business type is required').notEmpty(),
  body('description', 'Description must be at least 50 characters').isLength({ min: 50 }),
  body('category', 'Primary category is required').notEmpty(),
  body('specialties', 'At least one specialty is required').isArray({ min: 1 }),
  
  // Location
  body('address', 'Address is required').notEmpty(),
  body('city', 'City is required').notEmpty(),
  body('county', 'County is required').notEmpty(),

  // Contact Person
  body('contactPerson.name', 'Contact person name is required').notEmpty(),
  body('contactPerson.email', 'A valid contact person email is required').isEmail().normalizeEmail(),

  // This should be the last middleware in the chain
  handleValidationErrors,
];