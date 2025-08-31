import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors from express-validator
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors by field
    const formattedErrors = {};
    errors.array().forEach(error => {
      if (!formattedErrors[error.param]) {
        formattedErrors[error.param] = [];
      }
      formattedErrors[error.param].push(error.msg);
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  next();
};

// Validation rules for supplier registration route
export const validateSupplierRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Company name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Company name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
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
  // Add more validations as needed
];
