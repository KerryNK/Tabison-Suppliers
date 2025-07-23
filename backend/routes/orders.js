import express from 'express';
import Order from '../models/Order.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
const router = express.Router();

// GET all orders (user sees only their orders, admin sees all)
import mongoose from 'mongoose';
router.get('/', authenticate, async (req, res) => {
  let filter = {};
  if (!req.user || req.user.role !== 'admin') {
    filter.user = new mongoose.Types.ObjectId(req.user._id);
  }
  const orders = await Order.find(filter).populate('supplier').populate('items.product');
  res.json(orders);
});

// GET order by ID
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('supplier').populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// CREATE order (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const order = new Order({ ...req.body, user: req.user._id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE order (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE order (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router; 