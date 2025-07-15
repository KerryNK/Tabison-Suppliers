const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateProduct = [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('type').isIn(['Shoes', 'Bags', 'Accessories', 'Clothing']).withMessage('Invalid product type'),
  body('wholesalePrice').isFloat({ min: 0 }).withMessage('Wholesale price must be a positive number'),
  body('retailPrice').isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('supplier').isMongoId().withMessage('Valid supplier ID is required'),
  body('sku').trim().isLength({ min: 1 }).withMessage('SKU is required')
];

// GET all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      type, 
      status,
      supplier,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (status) query.status = status;
    if (supplier) query.supplier = supplier;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('supplier', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name email phone address');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new product
router.post('/', validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();
    
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('supplier', 'name email');
    
    res.status(201).json(populatedProduct);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('supplier', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'Active' });
    const lowStockProducts = await Product.countDocuments({ stockQuantity: { $lt: 10 } });
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$wholesalePrice', '$stockQuantity'] } } } }
    ]);

    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalInventoryValue: totalValue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
