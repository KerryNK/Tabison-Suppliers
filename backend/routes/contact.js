import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('message', 'Message is required').not().isEmpty(),
    body('category', 'Category is required').isIn(['general', 'shoes', 'tech', 'gear']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    try {
      const { name, email, company, message, category } = req.body;

      // In a real application, you would save this to a database or send an email.
      console.log('Contact form submission received:', { name, email, company, message, category });

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      res.json({
        message: 'Thank you for your message. We will get back to you soon!',
      });
    } catch (error) {
      console.error('Error processing contact form:', error.message);
      res.status(500).json({ message: 'Server error: Failed to submit form' });
    }
  }
);

export default router;