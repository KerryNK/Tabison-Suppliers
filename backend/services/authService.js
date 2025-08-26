// services/authService.js
const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../utils/emailService');

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

async function registerUserService(userData) {
  const { name, email, phone, password, role } = userData;

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    throw new Error('User already exists');
  }

  const otpCode = generateOTP();

  await OTP.create({
    identifier: email,
    code: otpCode,
    type: 'email_verification',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
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

  await sendOTPEmail(email, otpCode, name);

  return {
    message: 'Registration successful. Please verify your email with the OTP sent.',
    userId: user._id,
    email: user.email,
  };
}

module.exports = {
  registerUserService,
  // add other service methods here, e.g. verifyOTPService, loginUserService, etc.
};
