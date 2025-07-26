import express from 'express';
import PurchaseOrder from '../models/purchaseOrderModel.js';
const router = express.Router();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// POST /payments
router.post('/', async (req, res) => {
  const { orderId, method } = req.body;
  if (!orderId || !method) return res.status(400).json({ message: 'Missing orderId or method' });

  // Simulate payment processing delay in a safe way
  await delay(1000);

  const order = await PurchaseOrder.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentStatus = 'Paid';
  order.status = 'Confirmed';
  await order.save();
  res.json({ message: 'Payment successful', order });
});

export default router; 