import express from 'express';
import { registerSupplier } from '../controllers/supplierController.js'; // Correct path
import { supplierRegistrationValidator } from '../middleware/supplierValidator.js'; // Correct path

const router = express.Router();

// @route   POST /api/suppliers/register
// @desc    Register a new supplier
// @access  Public
router.post('/register', supplierRegistrationValidator, registerSupplier);

// You can add other supplier-related routes here

export default router;