import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  // The file path is available at req.file.path
  res.send({ message: 'Image Uploaded', image: `/${req.file.path}` });
});

export default router;