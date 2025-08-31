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
} = require('../controllers/authController'); // ✅ Fixed!

const { validateSchema } = require('../middleware/validationMiddleware');
const {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
} = require('../validation/schemas');

const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const { validateSchema } = require('../middleware/validationMiddleware');
const {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
} = require('../validation/schemas'); // Joi schemas

const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Middleware to parse JSON bodies (remove if already applied globally in app)
router.use(express.json());

// Public routes with validation middleware where applicable
router.post('/register', validateSchema(registerSchema), registerUser);
router.post('/verify-otp', validateSchema(verifyOTPSchema), verifyOTP);
router.post('/resend-otp', validateSchema(resendOTPSchema), resendOTP);
router.post('/login', validateSchema(loginSchema), loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Placeholder OTP email routes - move these to controllers for cleaner code
router.post('/send-otp-email', async (req, res) => {
  try {
    const { email } = req.body;
    // Implement actual OTP sending logic here
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/verify-otp-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Implement actual OTP verification logic here
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes with auth middleware in correct order
router.post('/enable-2fa', protect, admin, enable2FA);
router.post('/confirm-2fa', protect, admin, confirm2FA);

module.exports = router;
