const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { verifyIdToken, setCustomUserClaims } = require("../config/firebase")
const { 
  verifyFirebaseToken, 
  optionalFirebaseAuth, 
  requireAdmin,
  requireActiveAccount 
} = require("../middleware/firebaseAuth")

const router = express.Router()

// @desc    Register user with email/password
// @route   POST /api/auth/register
// @access  Public
router.post("/register", [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { name, email, password, phone, company, businessType, firebaseUid } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phoneNumber: phone,
      authProvider: firebaseUid ? 'firebase' : 'email',
      profile: {
        company,
        businessType,
      },
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "30d" }
    )

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          authProvider: user.authProvider,
          profile: user.profile,
        },
        token,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Login user with email/password
// @route   POST /api/auth/login
// @access  Public
router.post("/login", [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      })
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Please contact support.",
      })
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "30d" }
    )

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          authProvider: user.authProvider,
          profile: user.profile,
          lastLogin: user.lastLogin,
        },
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Firebase authentication sync
// @route   POST /api/auth/firebase-sync
// @access  Public (but requires Firebase token)
router.post("/firebase-sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Firebase token required',
      })
    }

    const token = authHeader.split(' ')[1]
    const decodedToken = await verifyIdToken(token)
    const { firebaseUser } = req.body

    // Find or create user
    let user = await User.findOne({
      $or: [
        { email: decodedToken.email },
        { googleId: decodedToken.uid },
        { appleId: decodedToken.uid }
      ]
    })

    if (!user && decodedToken.email) {
      // Create new user from Firebase data
      user = new User({
        name: firebaseUser.displayName || decodedToken.email.split('@')[0],
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        phoneNumber: decodedToken.phone_number,
        phoneVerified: !!decodedToken.phone_number,
        avatar: firebaseUser.photoURL,
        authProvider: firebaseUser.authProvider || 'firebase',
        verified: decodedToken.email_verified || false,
      })

      // Set provider-specific ID
      if (decodedToken.firebase?.sign_in_provider === 'google.com') {
        user.googleId = decodedToken.uid
        user.authProvider = 'google'
      } else if (decodedToken.firebase?.sign_in_provider === 'apple.com') {
        user.appleId = decodedToken.uid
        user.authProvider = 'apple'
      } else if (decodedToken.firebase?.sign_in_provider === 'phone') {
        user.authProvider = 'otp'
      }

      await user.save()

      // Set custom claims in Firebase
      try {
        await setCustomUserClaims(decodedToken.uid, {
          role: user.role,
          databaseId: user._id.toString()
        })
      } catch (claimsError) {
        console.error('Failed to set custom claims:', claimsError)
      }
    } else if (user) {
      // Update existing user
      user.lastLogin = new Date()
      
      // Update fields if they've changed
      if (firebaseUser.displayName && user.name !== firebaseUser.displayName) {
        user.name = firebaseUser.displayName
      }
      if (firebaseUser.photoURL && user.avatar !== firebaseUser.photoURL) {
        user.avatar = firebaseUser.photoURL
      }
      if (decodedToken.email_verified && !user.emailVerified) {
        user.emailVerified = true
      }
      if (decodedToken.phone_number && !user.phoneNumber) {
        user.phoneNumber = decodedToken.phone_number
        user.phoneVerified = true
      }

      await user.save()
    }

    res.status(200).json({
      success: true,
      message: "Firebase sync successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        authProvider: user.authProvider,
        profile: user.profile,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Firebase sync error:", error)
    res.status(500).json({
      success: false,
      message: "Firebase sync failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        phoneNumber: user.phoneNumber,
        authProvider: user.authProvider,
        profile: user.profile,
        preferences: user.preferences,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Update user profile
// @route   PUT /api/auth/user/:id
// @access  Private
router.put("/user/:id", verifyFirebaseToken, requireActiveAccount, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if user can update this profile
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      })
    }

    // Remove sensitive fields from updates
    delete updates.password
    delete updates.role
    delete updates._id
    delete updates.googleId
    delete updates.appleId
    delete updates.emailVerified
    delete updates.createdAt
    delete updates.updatedAt

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        preferences: user.preferences,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Generate OTP for phone verification
// @route   POST /api/auth/generate-otp
// @access  Private
router.post("/generate-otp", verifyFirebaseToken, async (req, res) => {
  try {
    const { phoneNumber } = req.body

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      })
    }

    // Generate OTP
    const otp = req.user.generateOTP()
    req.user.phoneNumber = phoneNumber
    await req.user.save()

    // TODO: Send OTP via SMS using Twilio or Africa's Talking
    console.log(`OTP for ${phoneNumber}: ${otp}`)

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // Don't send OTP in response in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    })
  } catch (error) {
    console.error("OTP generation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Private
router.post("/verify-otp", verifyFirebaseToken, async (req, res) => {
  try {
    const { otp } = req.body

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      })
    }

    const isValid = req.user.verifyOTP(otp)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      })
    }

    await req.user.save()

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Admin: Get all users
// @route   GET /api/auth/admin/users
// @access  Private (Admin only)
router.get("/admin/users", verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query

    const query = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }
    
    if (role) {
      query.role = role
    }
    
    if (status) {
      if (status === 'active') query.isActive = true
      if (status === 'inactive') query.isActive = false
      if (status === 'blocked') query.isBlocked = true
    }

    const users = await User.find(query)
      .select("-password -otp -resetPasswordToken")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Admin users fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Admin: Update user role or status
// @route   PUT /api/auth/admin/users/:id
// @access  Private (Admin only)
router.put("/admin/users/:id", verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { role, isActive, isBlocked } = req.body

    const updateFields = {}
    if (role !== undefined) updateFields.role = role
    if (isActive !== undefined) updateFields.isActive = isActive
    if (isBlocked !== undefined) updateFields.isBlocked = isBlocked

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update Firebase custom claims if role changed
    if (role !== undefined) {
      try {
        // Get user's Firebase UID (this would need to be stored or looked up)
        await setCustomUserClaims(user.googleId || user.appleId, {
          role: user.role,
          databaseId: user._id.toString()
        })
      } catch (claimsError) {
        console.error('Failed to update Firebase claims:', claimsError)
      }
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    })
  } catch (error) {
    console.error("Admin user update error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

module.exports = router
