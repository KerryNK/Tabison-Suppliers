
const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user with OTP
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'client' } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otpCode = generateOTP();
    
    // Save OTP to database
    await OTP.create({
      identifier: email,
      code: otpCode,
      type: 'email_verification',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isEmailVerified: false,
      isPhoneVerified: false
    });

    // Send OTP email
    await sendOTPEmail(email, otpCode, name);

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent.',
      userId: user._id,
      email: user.email
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { identifier, code, type } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      identifier,
      code,
      type,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user verification status
    const updateField = type === 'email_verification' ? 'isEmailVerified' : 'isPhoneVerified';
    const user = await User.findOneAndUpdate(
      { [type === 'email_verification' ? 'email' : 'phone']: identifier },
      { [updateField]: true },
      { new: true }
    ).select('-password');

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      message: 'Verification successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { identifier, type } = req.body;

    // Generate new OTP
    const otpCode = generateOTP();

    // Delete existing OTP
    await OTP.deleteMany({ identifier, type });

    // Create new OTP
    await OTP.create({
      identifier,
      code: otpCode,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP based on type
    if (type === 'email_verification') {
      const user = await User.findOne({ email: identifier });
      await sendOTPEmail(identifier, otpCode, user?.name || 'User');
    }
    // Add SMS sending logic here for phone verification

    res.json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true
      });
    }

    // Check 2FA for admin users
    if (user.role === 'admin' && user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          message: '2FA code required',
          requires2FA: true,
          tempToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' })
        });
      }

      // Verify 2FA code
      const otpRecord = await OTP.findOne({
        identifier: email,
        code: twoFactorCode,
        type: '2fa',
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired 2FA code' });
      }

      await OTP.deleteOne({ _id: otpRecord._id });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save reset token to user
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, user.name);

    res.json({ message: 'Password reset link sent to email' });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset token
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Enable 2FA for admin
const enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can enable 2FA' });
    }

    // Generate and send 2FA setup code
    const setupCode = generateOTP();
    
    await OTP.create({
      identifier: user.email,
      code: setupCode,
      type: '2fa_setup',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendOTPEmail(user.email, setupCode, user.name, '2FA Setup');

    res.json({ message: '2FA setup code sent to email' });

  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm 2FA setup
const confirm2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);

    const otpRecord = await OTP.findOne({
      identifier: user.email,
      code,
      type: '2fa_setup',
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired setup code' });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();

    // Delete setup OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: '2FA enabled successfully' });

  } catch (error) {
    console.error('Confirm 2FA error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  requestPasswordReset,
  resetPassword,
  enable2FA,
  confirm2FA
};
