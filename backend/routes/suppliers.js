import express from 'express';
import Supplier from '../models/Supplier.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for registration
const registrationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 registration attempts per windowMs
  message: { message: 'Too many registration attempts, please try again later.' }
});

// Validation middleware
const validateSupplierRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('county').trim().isLength({ min: 2, max: 50 }).withMessage('County must be between 2 and 50 characters'),
  body('category').isIn(['Military Footwear', 'Safety Footwear', 'Official Footwear', 'Security Footwear', 'Industrial Footwear', 'Professional Footwear']).withMessage('Please select a valid category'),
  body('description').trim().isLength({ min: 50, max: 1000 }).withMessage('Description must be between 50 and 1000 characters'),
  body('contactPerson.name').trim().isLength({ min: 2, max: 100 }).withMessage('Contact person name is required'),
  body('specialties').isArray({ min: 1 }).withMessage('At least one specialty is required')
];

const validateSupplierUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('description').optional().trim().isLength({ min: 50, max: 1000 }).withMessage('Description must be between 50 and 1000 characters')
];

// GET all suppliers with search and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      location, 
      verified, 
      minRating, 
      status = 'Active',
      page = 1, 
      limit = 12,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      category,
      location,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined
    };

    let query = Supplier.search(search, filters);
    
    // Add status filter (admin can see all, others only active)
    if (req.user?.role !== 'admin') {
      query = query.where({ status: 'Active' });
    } else if (status !== 'all') {
      query = query.where({ status });
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortOptions);

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const suppliers = await query.skip(skip).limit(parseInt(limit));
    
    // Get total count for pagination
    const totalQuery = Supplier.search(search, filters);
    if (req.user?.role !== 'admin') {
      totalQuery.where({ status: 'Active' });
    } else if (status !== 'all') {
      totalQuery.where({ status });
    }
    const total = await totalQuery.countDocuments();

    res.json({
      suppliers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      },
      filters: {
        search,
        category,
        location,
        verified,
        minRating,
        status
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET supplier by ID with view tracking
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Increment profile views (don't await to avoid slowing response)
    Supplier.findByIdAndUpdate(req.params.id, { 
      $inc: { profileViews: 1 },
      lastActive: new Date()
    }).exec();

    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST - Supplier registration (public with rate limiting)
router.post('/register', registrationLimit, validateSupplierRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    // Check if supplier with email already exists
    const existingSupplier = await Supplier.findOne({ email: req.body.email });
    if (existingSupplier) {
      return res.status(409).json({ 
        message: 'A supplier with this email already exists' 
      });
    }

    const supplierData = {
      ...req.body,
      status: 'Pending', // All new registrations start as pending
      verified: false,
      rating: 0,
      reviewCount: 0,
      totalRatings: 0,
      profileViews: 0
    };

    const supplier = new Supplier(supplierData);
    await supplier.save();

    // Don't send sensitive admin fields in response
    const responseSupplier = supplier.toObject();
    delete responseSupplier.approvedBy;
    delete responseSupplier.searchKeywords;

    res.status(201).json({
      message: 'Registration successful! Your application is under review.',
      supplier: responseSupplier
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: 'A supplier with this email already exists' 
      });
    }
    res.status(400).json({ 
      message: 'Registration failed', 
      error: err.message 
    });
  }
});

// PUT - Update supplier profile (protected)
router.put('/:id', authenticate, validateSupplierUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Check if user owns this supplier profile or is admin
    if (req.user.role !== 'admin' && supplier.email !== req.user.email) {
      return res.status(403).json({ 
        message: 'You can only update your own supplier profile' 
      });
    }

    // Prevent non-admins from updating certain fields
    const restrictedFields = ['status', 'verified', 'verificationDate', 'approvedBy', 'approvedAt', 'rating', 'reviewCount', 'totalRatings'];
    if (req.user.role !== 'admin') {
      restrictedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          delete req.body[field];
        }
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, lastActive: new Date() }, 
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Supplier profile updated successfully',
      supplier: updatedSupplier
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Update failed', 
      error: err.message 
    });
  }
});

// PATCH - Admin actions (approve, reject, suspend)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const validStatuses = ['Pending', 'Active', 'Inactive', 'Suspended'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    const updateData = {
      status,
      lastActive: new Date()
    };

    if (status === 'Active') {
      updateData.verified = true;
      updateData.verificationDate = new Date();
      updateData.approvedBy = req.user.id;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = undefined;
    } else if (status === 'Inactive' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
      updateData.verified = false;
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({
      message: `Supplier status updated to ${status}`,
      supplier
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Status update failed', 
      error: err.message 
    });
  }
});

// GET - Admin dashboard stats
router.get('/admin/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const stats = await Promise.all([
      Supplier.countDocuments({ status: 'Pending' }),
      Supplier.countDocuments({ status: 'Active' }),
      Supplier.countDocuments({ status: 'Inactive' }),
      Supplier.countDocuments({ status: 'Suspended' }),
      Supplier.countDocuments({ verified: true }),
      Supplier.countDocuments({ verified: false }),
      Supplier.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Supplier.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      statusCounts: {
        pending: stats[0],
        active: stats[1],
        inactive: stats[2],
        suspended: stats[3]
      },
      verificationCounts: {
        verified: stats[4],
        unverified: stats[5]
      },
      categoryDistribution: stats[6],
      topCities: stats[7]
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch stats', 
      error: err.message 
    });
  }
});

// DELETE supplier (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ 
      message: 'Supplier deleted successfully',
      deletedSupplier: {
        id: supplier._id,
        name: supplier.name,
        email: supplier.email
      }
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Delete failed', 
      error: err.message 
    });
  }
});

export default router;