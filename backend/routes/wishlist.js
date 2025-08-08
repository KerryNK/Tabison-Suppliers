import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();
router.use(protect);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;


