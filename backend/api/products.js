import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
// import { protect, admin } from '../middleware/authMiddleware.js'; // TODO: Add auth later

const router = express.Router();

// Public routes
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);

// Admin/Protected routes (add middleware back in later)
router.route('/').post(/* protect, admin, */ createProduct);
router.route('/:id').put(/* protect, admin, */ updateProduct).delete(/* protect, admin, */ deleteProduct);

export default router;
