import express from 'express';
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  requestPasswordReset,
  resetPassword,
  enable2FA,
  confirm2FA
} from '../controllers/authController.js';

import { validateSchema } from '../middleware/validationMiddleware.js';
import {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
} from '../validation/schemas.js';

import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Public routes with validation middleware
router.post('/register', validateSchema(registerSchema), registerUser);
router.post('/verify-otp', validateSchema(verifyOTPSchema), verifyOTP);
router.post('/resend-otp', validateSchema(resendOTPSchema), resendOTP);
router.post('/login', validateSchema(loginSchema), loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Placeholder OTP email routes
router.post('/send-otp-email', async (req, res) => {
  try {
    const { email } = req.body;
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-otp-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
router.post('/enable-2fa', protect, admin, enable2FA);
router.post('/confirm-2fa', protect, admin, confirm2FA);

export default router;