import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addItem, removeItem, updateQuantity, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/add', addItem);
router.delete('/items/:productId', removeItem);
router.put('/items/:productId', updateQuantity);
router.delete('/clear', clearCart);
router.delete('/', clearCart);

export default router;


