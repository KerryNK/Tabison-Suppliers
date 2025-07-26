import { body, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validation rules for the supplier registration route.
 */
export const validateSupplierRegistration = [
  body('name').notEmpty().withMessage('Company name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('category').notEmpty().withMessage('A primary category is required'),
  body('businessType').notEmpty().withMessage('Business type is required'),
  body('address').notEmpty().withMessage('Business address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('county').notEmpty().withMessage('County is required'),
  body('description')
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters long'),
  body('specialties')
    .isArray({ min: 1 })
    .withMessage('At least one specialty is required'),
  body('contactPerson.name')
    .notEmpty()
    .withMessage('Contact person name is required'),
  body('contactPerson.email')
    .isEmail()
    .withMessage('Please provide a valid contact person email'),
  // Add more validation for other fields as needed
];