import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

// To protect routes, you can import and use middleware like this:
// import { protect, admin } from '../middleware/authMiddleware.js';

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
// Note: You can add protection middleware (e.g., protect, admin) once it's implemented.
router.route('/').post(/* protect, admin, */ createProduct);
router.route('/:id').put(/* protect, admin, */ updateProduct);
router.route('/:id').delete(/* protect, admin, */ deleteProduct);

export default router;