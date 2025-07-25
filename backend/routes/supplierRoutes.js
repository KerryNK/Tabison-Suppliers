import express from 'express';
import {
  registerSupplier,
  searchSuppliers,
  getStats,
} from '../controllers/supplierController.js';

const router = express.Router();

router.post('/register', registerSupplier);
router.get('/search', searchSuppliers);
router.get('/stats', getStats);

export default router;