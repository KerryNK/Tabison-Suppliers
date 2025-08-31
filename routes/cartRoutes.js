import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addItem, removeItem, updateQuantity, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/add', addItem);
router.post('/remove', async (req, res) => {
  const { productId } = req.body;
  req.params.productId = productId;
  return removeItem(req, res);
});
router.patch('/:productId', updateQuantity);
router.delete('/clear', clearCart);

export default router;


