import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Protect all dashboard routes and require admin role
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);

export default router;
