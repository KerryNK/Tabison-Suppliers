import express from 'express';
import Order from '../models/Order.js';
const router = express.Router();

// POST /payments
router.post('/', async (req, res) => {
  const { orderId, method } = req.body;
  if (!orderId || !method) return res.status(400).json({ message: 'Missing orderId or method' });
  // Simulate payment processing delay
  setTimeout(async () => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.paymentStatus = 'Paid';
      order.status = 'Confirmed';
      await order.save();
      res.json({ message: 'Payment successful', order });
    } catch (err) {
      res.status(500).json({ message: 'Payment failed', error: err.message });
    }
  }, 1000);
});

export default router; 