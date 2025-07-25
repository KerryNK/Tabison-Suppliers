import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';

// This middleware will be created later to protect routes
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// The 'protect' middleware would be added to these routes
router.route('/').post(/* protect, */ addOrderItems);
router.route('/myorders').get(/* protect, */ getMyOrders);
router.route('/:id').get(/* protect, */ getOrderById);

export default router;