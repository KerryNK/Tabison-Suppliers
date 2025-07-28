import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409); // 409 Conflict is more specific for duplicates
    throw new Error('User with this email already exists');
  }
  
  const user = await User.create({ name, email, password, role });

  // Log the user in immediately after registration
  generateToken(res, user._id, user.role);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

  generateToken(res, user._id, user.role);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export default router;
