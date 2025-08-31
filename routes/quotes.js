import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { submitQuote, listQuotes, updateQuoteStatus } from '../controllers/quoteController.js';

const router = express.Router();
router.post('/', protect, submitQuote);
router.get('/', protect, authorize('admin'), listQuotes);
router.patch('/:id', protect, authorize('admin'), updateQuoteStatus);

export default router;


