import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import cloudinary from '../utils/cloudinary.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  if (cloudinary && req.file?.path) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'tabison/products' });
      return res.send({ message: 'Image Uploaded', image: result.secure_url });
    } catch (e) {
      console.error('Cloudinary upload failed, falling back to local path', e);
    }
  }
  // Fallback to local path if Cloudinary not configured or failed
  res.send({ message: 'Image Uploaded', image: `/${req.file.path}` });
});

export default router;
