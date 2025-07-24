import { body } from 'express-validator';

export const validateSupplierRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters').escape(),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters').escape(),
  body('city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters').escape(),
  body('county').trim().isLength({ min: 2, max: 50 }).withMessage('County must be between 2 and 50 characters').escape(),
  body('category').isIn(['Military Footwear', 'Safety Footwear', 'Official Footwear', 'Security Footwear', 'Industrial Footwear', 'Professional Footwear']).withMessage('Please select a valid category'),
  body('description').trim().isLength({ min: 50, max: 1000 }).withMessage('Description must be between 50 and 1000 characters').escape(),
  body('contactPerson.name').trim().isLength({ min: 2, max: 100 }).withMessage('Contact person name is required').escape(),
  body('specialties').isArray({ min: 1 }).withMessage('At least one specialty is required')
];

export const validateSupplierUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters').escape(),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('description').optional().trim().isLength({ min: 50, max: 1000 }).withMessage('Description must be between 50 and 1000 characters').escape()
];