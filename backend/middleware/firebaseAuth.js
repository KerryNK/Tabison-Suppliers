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
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
        email: decodedToken.email,
        authProvider: decodedToken.firebase?.sign_in_provider || 'email',
        googleId: decodedToken.firebase?.sign_in_provider === 'google.com' ? decodedToken.uid : undefined,
        appleId: decodedToken.firebase?.sign_in_provider === 'apple.com' ? decodedToken.uid : undefined,
        emailVerified: decodedToken.email_verified || false,
        photoURL: decodedToken.picture,
        isActive: true,
        role: 'user' // Default role
      })
      await user.save()
    }
    
    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      })
    }
    
    req.user = user
    req.firebaseUser = decodedToken
    next()
  } catch (error) {
    console.error('Firebase token verification error:', error)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    })
  }
}

// Middleware to check if user has admin role
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.',
      })
    }
    
    next()
  } catch (error) {
    console.error('Admin access check error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check.',
    })
  }
}

// Middleware to check if user has supplier role or higher
const requireSupplier = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }
    
    if (!['supplier', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Supplier access required.',
      })
    }
    
    next()
  } catch (error) {
    console.error('Supplier access check error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check.',
    })
  }
}

// Middleware to require active account
const requireActiveAccount = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }
    
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      })
    }
    
    next()
  } catch (error) {
    console.error('Active account check error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during account status check.',
    })
  }
}

// Optional authentication middleware (doesn't fail if no token)
const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null
      req.firebaseUser = null
      return next()
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
      
      req.user = user
      req.firebaseUser = decodedToken
    } catch (tokenError) {
      // Token is invalid, but we continue without authentication
      req.user = null
      req.firebaseUser = null
    }
    
    next()
  } catch (error) {
    console.error('Optional Firebase auth error:', error)
    req.user = null
    req.firebaseUser = null
    next()
  }
}

module.exports = {
  verifyFirebaseToken,
  requireAdmin,
  requireSupplier,
  requireActiveAccount,
  optionalFirebaseAuth
}