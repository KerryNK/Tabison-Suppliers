import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  submitContact,
  listContacts,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';

const router = express.Router();

// Public route - submit contact form
router.post('/', submitContact);

// Admin routes - manage contact messages
router.get('/', protect, authorize('admin'), listContacts);
router.patch('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;
