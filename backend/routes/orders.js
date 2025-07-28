import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes below are protected
router.use(protect);

router.route('/').post(addOrderItems).get(authorize('admin'), getOrders);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/deliver').put(authorize('admin'), updateOrderToDelivered);

export default router;
