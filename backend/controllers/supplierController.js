import Supplier from '../models/supplierModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js'; // Assuming this model exists

/**
 * @desc    Register a new supplier
 * @route   POST /api/suppliers/register
 * @access  Public
 */
const registerSupplier = async (req, res) => {
  const { email } = req.body;

  const supplierExists = await Supplier.findOne({ email });

  if (supplierExists) {
    res.status(400);
    throw new Error('A supplier with this email already exists');
  }

  const supplier = await Supplier.create(req.body);

  if (supplier) {
    res.status(201).json({
      _id: supplier._id,
      name: supplier.name,
      email: supplier.email,
      message: 'Registration successful. Your application is under review.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid supplier data');
  }
};

/**
 * @desc    Search for suppliers
 * @route   GET /api/suppliers/search
 * @access  Public
 */
const searchSuppliers = async (req, res) => {
  const { q, category, location } = req.query;
  const query = { status: 'approved' }; // Only show approved suppliers

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { specialties: { $regex: q, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (location) query.city = { $regex: location, $options: 'i' };

  const suppliers = await Supplier.find(query);
  res.json({ suppliers });
};

/**
 * @desc    Get platform statistics for the dashboard
 * @route   GET /api/suppliers/stats
 * @access  Public (or Admin)
 */
const getStats = async (req, res) => {
  // countDocuments is much more efficient than fetching all documents to get the length.
  const supplierCount = await Supplier.countDocuments({ status: 'approved' });
  const productCount = await Product.countDocuments({});
  const orderCount = await Order.countDocuments({});

  // You can also perform more complex aggregations efficiently here.
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
  ]);

  res.json({
    suppliers: supplierCount,
    products: productCount,
    orders: orderCount,
    orderData: ordersByStatus,
  });
};

export { registerSupplier, searchSuppliers, getStats };