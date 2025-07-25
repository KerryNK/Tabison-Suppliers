import express from 'express';
import {
  registerSupplier,
  searchSuppliers,
} from '../controllers/supplierController.js';

const router = express.Router();

router.post('/register', registerSupplier);
router.get('/search', searchSuppliers);

export default router;