import express from 'express';
import {
  registerSupplier,
  searchSuppliers,
  getStats,
} from '../controllers/supplierController.js';
import {
  validateSupplierRegistration,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateSupplierRegistration, handleValidationErrors, registerSupplier);
router.get('/search', searchSuppliers);
router.get('/stats', getStats);

export default router;