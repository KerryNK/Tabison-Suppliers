const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Joi = require('joi'); // for validation
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Generate JWT
const generateToken = (id) =>
jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


// Validation schemas with Joi
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\\+?\\d{7,15}$/).required(), // simple phone regex
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('client', 'admin').default('client'),
});


const verifyOTPSchema = Joi.object({
  identifier: Joi.string().required(),
  code: Joi.string().length(6).pattern(/^\\d{6}$/).required(),
  type: Joi.string().valid('email\_verification', 'phone\_verification').required(),
});


const resendOTPSchema = Joi.object({
  identifier: Joi.string().required(),
  type: Joi.string().valid('email\_verification', 'phone\_verification').required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  twoFactorCode: Joi.string().length(6).pattern(/^\\d{6}$/).optional(),
});


// Placeholders: use a proper rate limiter middleware like express-rate-limit or Redis in production
const fakeRateLimiter = async (req, res, next) => {
  // TODO: Integrate with real rate limiting based on IP or user
  return next();
};


// Register user with OTP
const registerUser = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, phone, password, role } = value;


    await fakeRateLimiter(req, res, () => {});


    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const otpCode = generateOTP();


    await OTP.create({
      identifier: email,
      code: otpCode,
      type: 'email\_verification',
      expiresAt: new Date(Date.now() + 10 \* 60 \* 1000),
    });


    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isEmailVerified: false,
      isPhoneVerified: false,
    });


    // Consider sending email asynchronously via a queue for scalability
    await sendOTPEmail(email, otpCode, name);


    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent.',
      userId: user.\_id,
      email: user.email,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { error, value } = verifyOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { identifier, code, type } = value;


    const otpRecord = await OTP.findOne({
      identifier,
      code,
      type,
      expiresAt: { $gt: new Date() },
    });


    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    const updateField =
      type === 'email\_verification' ? 'isEmailVerified' : 'isPhoneVerified';


    const user = await User.findOneAndUpdate(
      { [type === 'email\_verification' ? 'email' : 'phone']: identifier },
      { [updateField]: true },
      { new: true }
    ).select('-password');


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    await OTP.deleteOne({ \_id: otpRecord.\_id });


    res.json({
      message: 'Verification successful',
      token: generateToken(user.\_id),
      user: {
        id: user.\_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { error, value } = resendOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { identifier, type } = value;


    await fakeRateLimiter(req, res, () => {});


    const otpCode = generateOTP();


    await OTP.deleteMany({ identifier, type });


    await OTP.create({
      identifier,
      code: otpCode,
      type,
      expiresAt: new Date(Date.now() + 10 \* 60 \* 1000),
    });


    if (type === 'email\_verification') {
      const user = await User.findOne({ email: identifier });
      // Consider async email sending here
      await sendOTPEmail(identifier, otpCode, user?.name || 'User');
    }
    // TODO: Add SMS sending here for phone verification


    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login user
const loginUser = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password, twoFactorCode } = value;


    await fakeRateLimiter(req, res, () => {});


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in',
        requiresVerification: true,
      });
    }


    // 2FA for admin users
    if (user.role === 'admin' && user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          message: '2FA code required',
          requires2FA: true,
          tempToken: jwt.sign({ id: user.\_id }, process.env.JWT\_SECRET, {
            expiresIn: '5m',
          }),
        });
      }


      const otpRecord = await OTP.findOne({
        identifier: email,
        code: twoFactorCode,
        type: '2fa',
        expiresAt: { $gt: new Date() },
      });


      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired 2FA code' });
      }


      await OTP.deleteOne({ \_id: otpRecord.\_id });
    }


    user.lastLogin = new Date();
    await user.save();


    res.json({
      token: generateToken(user.\_id),
      user: {
        id: user.\_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const email = req.body.email;


    await fakeRateLimiter(req, res, () => {});


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');


    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 \* 60 \* 1000);
    await user.save();


    // Consider async email sending for scalability
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
    if (!req.body.password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const { token } = req.params;
    const { password } = req.body;


    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });


    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }


    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);


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


    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can enable 2FA' });
    }


    const setupCode = generateOTP();


    await OTP.create({
      identifier: user.email,
      code: setupCode,
      type: '2fa\_setup',
      expiresAt: new Date(Date.now() + 10 \* 60 \* 1000),
    });


    // Consider async email sending
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
    if (!req.body.code) {
      return res.status(400).json({ message: '2FA setup code is required' });
    }
    const { code } = req.body;
    const user = await User.findById(req.user.id);


    const otpRecord = await OTP.findOne({
      identifier: user.email,
      code,
      type: '2fa\_setup',
      expiresAt: { $gt: new Date() },
    });


    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired setup code' });
    }


    user.twoFactorEnabled = true;
    await user.save();


    await OTP.deleteOne({ \_id: otpRecord.\_id });


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
  confirm2FA,
};