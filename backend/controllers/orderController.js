import PurchaseOrder from '../models/purchaseOrderModel.js';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = async (req, res) => {
  const { orderNumber, supplier, items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const po = new PurchaseOrder({
    orderNumber: orderNumber || `ORD-${Date.now()}`,
    supplier,
    user: req.user._id,
    items: items.map(i => ({
      product: i.product || i._id,
      quantity: i.quantity || i.qty || 1,
      unitPrice: i.unitPrice || i.price || 0,
      totalPrice: i.totalPrice || (i.unitPrice || i.price || 0) * (i.quantity || i.qty || 1),
    })),
    totalAmount: totalAmount ?? items.reduce((sum, i) => sum + (i.totalPrice || (i.unitPrice || i.price || 0) * (i.quantity || i.qty || 1)), 0),
    status: 'Pending',
    paymentStatus: 'Pending',
  });

  const created = await po.save();
  // Decrement inventory
  try {
    const Product = (await import('../models/productModel.js')).default;
    for (const i of po.items) {
      await Product.updateOne({ _id: i.product }, { $inc: { countInStock: -i.quantity } });
    }
  } catch (e) {
    console.error('Inventory decrement failed', e);
  }
  res.status(201).json(created);
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  const orders = await PurchaseOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
  const orders = await PurchaseOrder.find({}).populate('user', 'id name');
  res.json(orders);
};

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
const updateOrderToDelivered = async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};