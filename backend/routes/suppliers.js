import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';
import * as supplierController from '../controllers/supplierController.js';
import { validateSupplierRegistration, validateSupplierUpdate } from '../validators/supplierValidator.js';

const router = express.Router();

// Rate limiting for registration
const registrationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 registration attempts per windowMs
  message: { message: 'Too many registration attempts, please try again later.' }
});

// --- Public Routes ---
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', registrationLimit, validateSupplierRegistration, supplierController.createSupplier);

// --- Protected Routes (requires authentication) ---
router.put('/:id', authenticate, validateSupplierUpdate, supplierController.updateSupplier);

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
    res.status(500).json({ 
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
    res.status(500).json({ 
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
    res.status(500).json({ 
      message: 'Delete failed', 
      error: err.message 
    });
  }
});

export default router;