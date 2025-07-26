import express from 'express';
import { getAppTitle, updateAppTitle } from '../controllers/appTitleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get the application title
router.get('/', getAppTitle);

// Admin-only route to update the application title
router.put('/', protect, authorize('admin'), updateAppTitle);

export default router;
