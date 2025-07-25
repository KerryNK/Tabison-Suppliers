import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), upload.array('images'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), upload.array('images'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;