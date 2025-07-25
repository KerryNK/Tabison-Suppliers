import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';

// This middleware will be created later to protect routes
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// The 'protect' and 'admin' middleware would be added to these routes
router.route('/').post(/* protect, */ addOrderItems).get(/* protect, admin, */ getOrders);
router.route('/myorders').get(/* protect, */ getMyOrders);
router.route('/:id').get(/* protect, */ getOrderById);
router.route('/:id/deliver').put(/* protect, admin, */ updateOrderToDelivered);

export default router;