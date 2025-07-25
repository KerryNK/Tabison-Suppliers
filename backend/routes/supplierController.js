import Supplier from '../models/Supplier.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * @desc    Register a new supplier
 * @route   POST /api/suppliers/register
 * @access  Public
 */
export const registerSupplier = async (req, res, next) => {
  // Data has been sanitized and validated by the middleware
  const supplierData = req.body;

  const supplierExists = await Supplier.findOne({ email: supplierData.email });

  if (supplierExists) {
    // Use 409 Conflict for existing resources
    return next(new ErrorHandler('A supplier with this email already exists.', 409));
  }

  // Create a new supplier instance
  // Note: The Mongoose schema will automatically handle mapping and defaults
  const newSupplier = new Supplier({
    ...supplierData,
    businessName: supplierData.name, // Assuming business name is the same as company name
  });

  const createdSupplier = await newSupplier.save();

  res.status(201).json({
    message: 'Supplier registration successful! Your application is under review.',
    supplier: {
      id: createdSupplier._id,
      name: createdSupplier.name,
      email: createdSupplier.email,
    },
  });
};