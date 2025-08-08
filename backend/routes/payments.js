import express from 'express';
import PurchaseOrder from '../models/purchaseOrderModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendPaymentReceipt } from '../utils/receiptEmail.js';
const router = express.Router();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// POST /payments
router.post('/', protect, async (req, res) => {
  const { orderId, method } = req.body;
  if (!orderId || !method) return res.status(400).json({ message: 'Missing orderId or method' });

  // Simulate payment processing delay in a safe way
  await delay(1000);

  const order = await PurchaseOrder.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentStatus = 'Paid';
  order.status = 'Confirmed';
  await order.save();
  try {
    await sendPaymentReceipt({ order, user: req.user, method });
  } catch (e) {
    // Log but don't fail payment if email fails
    console.error('Failed to send receipt email:', e);
  }
  res.json({ message: 'Payment successful', order });
});

export default router; 