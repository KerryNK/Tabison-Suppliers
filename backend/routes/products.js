import express from 'express';
import Product from '../models/Product.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find().populate('supplier');
  res.json(products);
});

// GET product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplier');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// CREATE product (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router; 