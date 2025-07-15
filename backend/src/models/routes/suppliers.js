const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateSupplier = [
  body('name').trim().isLength({ min: 1 }).withMessage('Supplier name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
  body('status').optional().isIn(['Active', 'Inactive', 'Pending']).withMessage('Invalid status'),
  body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// GET all suppliers with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'contactPerson.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (category) query.categories = category;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const suppliers = await Supplier.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Supplier.countDocuments(query);

    res.json({
      suppliers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single supplier
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new supplier
router.post('/', validateSupplier, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    
    res.status(201).json(savedSupplier);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT update supplier
router.put('/:id', validateSupplier, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET supplier statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalSuppliers = await Supplier.countDocuments();
    const activeSuppliers = await Supplier.countDocuments({ status: 'Active' });
    const pendingSuppliers = await Supplier.countDocuments({ status: 'Pending' });
    const avgRating = await Supplier.aggregate([
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);

    res.json({
      totalSuppliers,
      activeSuppliers,
      pendingSuppliers,
      averageRating: avgRating[0]?.average || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 