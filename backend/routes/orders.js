const express = require('express');
const Order = require('../models/Order');
const { authenticate, isAdmin } = require('../server');
const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('supplier').populate('items.product');
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
    const order = new Order(req.body);
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

module.exports = router; 