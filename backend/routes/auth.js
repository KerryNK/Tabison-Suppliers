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

// Send OTP Email - placeholder implementation
router.post('/send-otp-email', async (req, res) => {
  try {
    const { email } = req.body;
    // TODO: Implement actual OTP sending logic
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP Email - placeholder implementation
router.post('/verify-otp-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    // TODO: Implement actual OTP verification logic
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
router.post('/someEndpoint', someControllerFunction);
router.post('/enable-2fa', protect, admin, enable2FA);
router.post('/confirm-2fa', protect, admin, confirm2FA);

module.exports = router;