const express = require("express")
const router = express.Router()

// Sample users data (in production, this would be from database)
const sampleUsers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In production, this would be hashed
    role: "user",
  },
  {
    _id: "2",
    name: "Admin User",
    email: "admin@tabison.com",
    password: "admin123", // In production, this would be hashed
    role: "admin",
  },
]

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = sampleUsers.find((user) => user.email === email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create new user (in production, hash password)
    const newUser = {
      _id: String(sampleUsers.length + 1),
      name,
      email,
      password, // In production, hash this
      role: "user",
    }

    sampleUsers.push(newUser)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = sampleUsers.find((user) => user.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

module.exports = router
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", async (req, res) => {
  try {
    // In production, get user from token
    const user = sampleUsers[0] // Mock current user

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

module.exports = router
