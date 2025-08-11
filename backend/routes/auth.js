const express = require('express');
const {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  requestPasswordReset,
  resetPassword,
  enable2FA,
  confirm2FA
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.post('/enable-2fa', protect, admin, enable2FA);
router.post('/confirm-2fa', protect, admin, confirm2FA);

module.exports = router;