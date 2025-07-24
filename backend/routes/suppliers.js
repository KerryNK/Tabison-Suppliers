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
router.patch('/:id/status', authenticate, isAdmin, supplierController.updateSupplierStatus);
router.delete('/:id', authenticate, isAdmin, supplierController.deleteSupplier);

// --- Admin-Only Routes ---
router.get('/admin/stats', authenticate, isAdmin, supplierController.getAdminStats);
router.get('/admin/export-csv', authenticate, isAdmin, supplierController.exportSuppliersToCSV);

export default router;