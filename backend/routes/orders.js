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

// Public tracking by order number (no auth)
import PurchaseOrder from '../models/purchaseOrderModel.js';
router.get('/track/:orderNumber', async (req, res) => {
  const po = await PurchaseOrder.findOne({ orderNumber: req.params.orderNumber });
  if (!po) return res.status(404).json({ message: 'Order not found' });
  res.json({ orderNumber: po.orderNumber, status: po.status, paymentStatus: po.paymentStatus, createdAt: po.createdAt });
});

export default router;