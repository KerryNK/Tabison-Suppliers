import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
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
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateToken(res, user._id, user.role);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export default router; 