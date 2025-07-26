import express from 'express';
import {
  findSuppliers,
  findSupplierById,
  createSupplier,
  updateSupplier,
  updateSupplierStatus,
  deleteSupplier,
  getDashboardStats
} from '../routes/supplierService.js'; // Adjust path as necessary
import { protect, authorize } from '../middleware/authMiddleware.js'; // Assuming you have these
import { supplierRegistrationValidator } from '../middleware/supplierValidator.js'; // Assuming you have this

const router = express.Router();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const { search, category, location, verified, minRating, page, limit, sortBy, sortOrder } = req.query;
    const filters = { search, category, location, verified, minRating, page, limit, sortBy, sortOrder };
    const { suppliers, total } = await findSuppliers(filters, req.user); // Pass req.user for role-based access
    res.json({ suppliers, total });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const supplier = await findSupplierById(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  } catch (error) {
    next(error);
  }
});

// Protected routes (requires authentication)
router.post('/', protect, supplierRegistrationValidator, async (req, res, next) => {
  try {
    const supplier = await createSupplier({ ...req.body, user: req.user._id });
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const updatedSupplier = await updateSupplier(req.params.id, req.body, req.user);
    if (updatedSupplier) {
      res.json(updatedSupplier);
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  } catch (error) {
    next(error);
  }
});

// Admin-only routes
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const updatedSupplier = await updateSupplierStatus(req.params.id, status, rejectionReason, req.user._id);
    if (updatedSupplier) {
      res.json(updatedSupplier);
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const deletedSupplier = await deleteSupplier(req.params.id);
    if (deletedSupplier) {
      res.json({ message: 'Supplier removed' });
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/admin/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
