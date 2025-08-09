const admin = require('firebase-admin')

// Initialize Firebase Admin SDK
// In production, you should use service account key or environment variables
let firebaseApp

try {
  // For production, use service account credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  } else if (process.env.NODE_ENV === 'production') {
    // For production without explicit service account, use default credentials
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  } else {
    // For development, you can use the emulator or default credentials
    console.log('Firebase Admin: Using default credentials or emulator')
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'tabison-suppliers',
    })
  }
  
  console.log('✅ Firebase Admin initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message)
  
  // In development, continue without Firebase Admin if not configured
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️  Continuing without Firebase Admin in development mode')
  } else {
    process.exit(1)
  }
}

// Export Firebase Admin services
const auth = firebaseApp ? admin.auth() : null
const firestore = firebaseApp ? admin.firestore() : null
const storage = firebaseApp ? admin.storage() : null

// Helper function to verify Firebase ID token
const verifyIdToken = async (idToken) => {
  if (!auth) {
    throw new Error('Firebase Admin not initialized')
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    throw new Error('Invalid Firebase token: ' + error.message)
  }
}

// Helper function to get user by UID
const getUserByUid = async (uid) => {
  if (!auth) {
    throw new Error('Firebase Admin not initialized')
  }
  
  try {
    const userRecord = await auth.getUser(uid)
    return userRecord
  } catch (error) {
    throw new Error('User not found: ' + error.message)
  }
}

// Helper function to create custom token
const createCustomToken = async (uid, additionalClaims = {}) => {
  if (!auth) {
    throw new Error('Firebase Admin not initialized')
  }
  
  try {
    const customToken = await auth.createCustomToken(uid, additionalClaims)
    return customToken
  } catch (error) {
    throw new Error('Failed to create custom token: ' + error.message)
  }
}

// Helper function to set custom user claims (for roles)
const setCustomUserClaims = async (uid, customClaims) => {
  if (!auth) {
    throw new Error('Firebase Admin not initialized')
  }
  
  try {
    await auth.setCustomUserClaims(uid, customClaims)
    console.log(`Custom claims set for user ${uid}:`, customClaims)
  } catch (error) {
    throw new Error('Failed to set custom claims: ' + error.message)
  }
}

// Helper function to revoke refresh tokens (force logout)
const revokeRefreshTokens = async (uid) => {
  if (!auth) {
    throw new Error('Firebase Admin not initialized')
  }
  
  try {
    await auth.revokeRefreshTokens(uid)
    console.log(`Refresh tokens revoked for user ${uid}`)
  } catch (error) {
    throw new Error('Failed to revoke refresh tokens: ' + error.message)
  }
}

module.exports = {
  admin,
  auth,
  firestore,
  storage,
  verifyIdToken,
  getUserByUid,
  createCustomToken,
  setCustomUserClaims,
  revokeRefreshTokens,
}