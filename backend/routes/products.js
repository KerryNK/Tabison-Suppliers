import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route('/').get(getProducts);

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.route('/:id').get(getProductById);

// --- Admin Routes ---
router.route('/').post(protect, authorize('admin'), createProduct);
router.route('/:id').put(protect, authorize('admin'), updateProduct);
router.route('/:id').delete(protect, authorize('admin'), deleteProduct);

export default router;
