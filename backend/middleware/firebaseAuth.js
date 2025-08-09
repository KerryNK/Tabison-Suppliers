const { verifyIdToken } = require('../config/firebase')
const User = require('../models/User')

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(token)
    
    // Find or create user in our database
    let user = await User.findOne({ 
      $or: [
        { email: decodedToken.email },
        { googleId: decodedToken.uid },
        { appleId: decodedToken.uid }
      ]
    })
    
    if (!user && decodedToken.email) {
      // Create new user if doesn't exist
      user = new User({
        name: decodedToken.name || decodedToken.email.split('@')[0],
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        phoneNumber: decodedToken.phone_number,
        phoneVerified: !!decodedToken.phone_number,
        avatar: decodedToken.picture,
        authProvider: decodedToken.firebase?.sign_in_provider || 'firebase',
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
    }
    
    // Update last login
    if (user) {
      user.lastLogin = new Date()
      await user.save()
    }
    
    // Attach user and Firebase token info to request
    req.user = user
    req.firebaseUser = decodedToken
    
    next()
  } catch (error) {
    console.error('Firebase auth middleware error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

// Middleware to check if user exists (optional Firebase auth)
const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // Continue without authentication
    }
    
    const token = authHeader.split(' ')[1]
    
    try {
      const decodedToken = await verifyIdToken(token)
      
      const user = await User.findOne({ 
        $or: [
          { email: decodedToken.email },
          { googleId: decodedToken.uid },
          { appleId: decodedToken.uid }
        ]
      })
      
      if (user) {
        req.user = user
        req.firebaseUser = decodedToken
      }
    } catch (tokenError) {
      // Invalid token, but continue without auth
      console.warn('Optional auth token invalid:', tokenError.message)
    }
    
    next()
  } catch (error) {
    // Don't block request for optional auth errors
    console.error('Optional Firebase auth error:', error.message)
    next()
  }
}

// Middleware to check user role
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }
    
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${requiredRole} role required.`,
      })
    }
    
    next()
  }
}

// Middleware to check if user is admin
const requireAdmin = requireRole('admin')

// Middleware to check if user is supplier
const requireSupplier = requireRole('supplier')

// Middleware to check multiple roles
const requireAnyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. One of these roles required: ${roles.join(', ')}`,
      })
    }
    
    next()
  }
}

// Middleware to check if user owns resource or is admin
const requireOwnershipOrAdmin = (userIdField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }
    
    // Admin can access anything
    if (req.user.role === 'admin') {
      return next()
    }
    
    // Check if user owns the resource
    const resourceUserId = req.params.id || req.body[userIdField] || req.body.user
    
    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
      })
    }
    
    next()
  }
}

// Middleware to check if user account is active
const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }
  
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact support.',
    })
  }
  
  if (req.user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'Account is blocked. Please contact support.',
    })
  }
  
  next()
}

// Middleware to check if email is verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }
  
  if (!req.user.emailVerified && !req.user.verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email address.',
    })
  }
  
  next()
}

module.exports = {
  verifyFirebaseToken,
  optionalFirebaseAuth,
  requireRole,
  requireAdmin,
  requireSupplier,
  requireAnyRole,
  requireOwnershipOrAdmin,
  requireActiveAccount,
  requireEmailVerification,
}