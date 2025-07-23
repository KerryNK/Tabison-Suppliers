// ADD REVIEW to product
router.post('/:id/reviews', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Prevent duplicate review by same user (optional)
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }
    const review = {
      user: req.user._id,
      rating,
      comment,
      date: new Date()
    };
    product.reviews.push(review);
    await product.save();
    res.status(201).json(product.reviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
import express from 'express';
import Product from '../models/Product.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all products (with optional category filter, search, sorting, price range, and tag)
router.get('/', async (req, res) => {
  const { category, search, sort, minPrice, maxPrice, tag, ids } = req.query;
  const filter = {};
  if (ids) {
    const idArr = ids.split(',').map(id => id.trim());
    filter._id = { $in: idArr };
  }
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (minPrice || maxPrice) {
    filter.retailPrice = {};
    if (minPrice) filter.retailPrice.$gte = Number(minPrice);
    if (maxPrice) filter.retailPrice.$lte = Number(maxPrice);
  }
  if (tag) {
    filter.tags = tag;
  }
  let sortObj = {};
  if (sort === 'price_asc') sortObj = { retailPrice: 1 };
  else if (sort === 'price_desc') sortObj = { retailPrice: -1 };
  else if (sort === 'name_asc') sortObj = { name: 1 };
  else if (sort === 'name_desc') sortObj = { name: -1 };
  else if (sort === 'newest') sortObj = { createdAt: -1 };
  else if (sort === 'oldest') sortObj = { createdAt: 1 };
  const products = await Product.find(filter).sort(sortObj).populate('supplier');
  res.json(products);
});

// GET product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplier');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// CREATE product (admin only, with image upload)
router.post('/', authenticate, isAdmin, upload.array('images'), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const product = new Product({ ...req.body, images });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product (admin only, with image upload)
router.put('/:id', authenticate, isAdmin, upload.array('images'), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : undefined;
    const update = { ...req.body };
    if (images && images.length) update.images = images;
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
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