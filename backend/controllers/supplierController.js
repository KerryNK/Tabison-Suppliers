import Supplier from '../models/supplierModel.js';

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

export { registerSupplier, searchSuppliers };