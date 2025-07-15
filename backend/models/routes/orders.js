const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateOrder = [
  body('supplier').isMongoId().withMessage('Valid supplier ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive'),
  body('status').optional().isIn(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid status'),
  body('paymentStatus').optional().isIn(['Pending', 'Paid', 'Partial']).withMessage('Invalid payment status')
];

// GET all orders with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      supplier,
      paymentStatus,
      sortBy = 'orderDate',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (supplier) query.supplier = supplier;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('supplier', 'name email')
      .populate('items.product', 'name sku imageUrl')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('supplier', 'name email phone address')
      .populate('items.product', 'name sku imageUrl wholesalePrice retailPrice');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new order
router.post('/', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of req.body.items) {
      item.totalPrice = item.quantity * item.unitPrice;
      totalAmount += item.totalPrice;
    }

    const orderData = {
      ...req.body,
      totalAmount
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();
    
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('supplier', 'name email')
      .populate('items.product', 'name sku');
    
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update order
router.put('/:id', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Recalculate total amount if items changed
    if (req.body.items) {
      let totalAmount = 0;
      for (const item of req.body.items) {
        item.totalPrice = item.quantity * item.unitPrice;
        totalAmount += item.totalPrice;
      }
      req.body.totalAmount = totalAmount;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('supplier', 'name email')
    .populate('items.product', 'name sku');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('supplier', 'name email')
    .populate('items.product', 'name sku');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET order statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const totalValue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Monthly orders for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyOrders = await Order.aggregate([
      { $match: { orderDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      shippedOrders,
      totalValue: totalValue[0]?.total || 0,
      monthlyOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 