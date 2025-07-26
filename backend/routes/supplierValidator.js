import { body, validationResult } from 'express-validator';

export const supplierRegistrationValidator = [
  // Basic Information
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('any') // Adjust locale as needed, e.g., 'en-US'
    .withMessage('Invalid phone number format'),
  body('website').optional().isURL().withMessage('Invalid website URL'),
  body('businessType')
    .trim()
    .notEmpty()
    .withMessage('Business type is required'),
  body('registrationNumber').optional().trim(),
  body('taxNumber').optional().trim(),
  body('yearEstablished')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid year established'),

  // Location
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('county').trim().notEmpty().withMessage('County is required'),
  body('postalCode').optional().trim(),

  // Categories and Specialties
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Military Footwear',
      'Safety Footwear',
      'Official Footwear',
      'Security Footwear',
      'Industrial Footwear',
      'Professional Footwear',
    ])
    .withMessage('Invalid product category'),
  body('specialties')
    .isArray()
    .withMessage('Specialties must be an array')
    .custom((value) => value.length >