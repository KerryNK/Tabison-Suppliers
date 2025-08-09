import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithCredential,
  linkWithCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  User as FirebaseUser
} from 'firebase/auth'
import { auth, googleProvider, appleProvider } from '../config/firebase'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Types
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  phoneNumber: string | null
  photoURL: string | null
  emailVerified: boolean
  isAnonymous: boolean
  role?: string
  backendUser?: any
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  company?: string
  businessType?: string
}

export interface OTPVerificationData {
  phoneNumber: string
  code: string
}

// Configure axios interceptors
axios.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null

  // Initialize reCAPTCHA verifier for phone authentication
  initializeRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved')
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired')
        }
      })
    }
    return this.recaptchaVerifier
  }

  // Email and password authentication
  async loginWithEmail(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      
      // Sync with backend
      const backendUser = await this.syncWithBackend(userCredential.user, 'email')
      
      return {
        ...this.mapFirebaseUser(userCredential.user),
        backendUser
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  async registerWithEmail(data: RegisterData): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: data.name
      })

      // Send email verification
      await sendEmailVerification(userCredential.user)

      // Create user in backend
      const backendUser = await this.createBackendUser(userCredential.user, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        authProvider: 'email',
        profile: {
          company: data.company,
          businessType: data.businessType
        }
      })

      return {
        ...this.mapFirebaseUser(userCredential.user),
        backendUser
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Google authentication
  async loginWithGoogle(): Promise<AuthUser> {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      const backendUser = await this.syncWithBackend(userCredential.user, 'google')
      
      return {
        ...this.mapFirebaseUser(userCredential.user),
        backendUser
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Apple authentication
  async loginWithApple(): Promise<AuthUser> {
    try {
      const userCredential = await signInWithPopup(auth, appleProvider)
      const backendUser = await this.syncWithBackend(userCredential.user, 'apple')
      
      return {
        ...this.mapFirebaseUser(userCredential.user),
        backendUser
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Phone authentication
  async sendOTP(phoneNumber: string): Promise<string> {
    try {
      if (!this.recaptchaVerifier) {
        this.initializeRecaptcha()
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier!
      )

      return confirmationResult.verificationId
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  async verifyOTP(verificationId: string, code: string): Promise<AuthUser> {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      const userCredential = await signInWithCredential(auth, credential)
      
      const backendUser = await this.syncWithBackend(userCredential.user, 'otp')
      
      return {
        ...this.mapFirebaseUser(userCredential.user),
        backendUser
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Link phone number to existing account
  async linkPhoneNumber(verificationId: string, code: string): Promise<void> {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      const user = auth.currentUser
      
      if (!user) {
        throw new Error('No user logged in')
      }

      await linkWithCredential(user, credential)
      
      // Update backend user
      await this.updateBackendUser(user.uid, {
        phoneNumber: user.phoneNumber,
        phoneVerified: true
      })
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Password reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code))
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth)
      
      // Clear any local storage if needed
      localStorage.removeItem('authToken')
      sessionStorage.clear()
    } catch (error: any) {
      throw new Error('Logout failed')
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser
    return user ? this.mapFirebaseUser(user) : null
  }

  // Backend integration methods
  private async syncWithBackend(firebaseUser: FirebaseUser, authProvider: string): Promise<any> {
    try {
      const token = await firebaseUser.getIdToken()
      const response = await axios.post(`${API_BASE_URL}/auth/firebase-sync`, {
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          authProvider
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      return response.data.user
    } catch (error) {
      console.error('Backend sync failed:', error)
      return null
    }
  }

  private async createBackendUser(firebaseUser: FirebaseUser, userData: any): Promise<any> {
    try {
      const token = await firebaseUser.getIdToken()
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        firebaseUid: firebaseUser.uid,
        ...userData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      return response.data.user
    } catch (error) {
      console.error('Backend user creation failed:', error)
      return null
    }
  }

  private async updateBackendUser(uid: string, updates: any): Promise<any> {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/user/${uid}`, updates)
      return response.data.user
    } catch (error) {
      console.error('Backend user update failed:', error)
      return null
    }
  }

  // Helper methods
  private mapFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      phoneNumber: firebaseUser.phoneNumber,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous
    }
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/popup-blocked': 'Sign-in popup was blocked by the browser.',
      'auth/invalid-verification-code': 'Invalid verification code.',
      'auth/invalid-verification-id': 'Invalid verification ID.',
      'auth/code-expired': 'Verification code has expired.',
      'auth/missing-verification-code': 'Missing verification code.',
      'auth/missing-verification-id': 'Missing verification ID.',
    }

    return errorMessages[errorCode] || 'An authentication error occurred. Please try again.'
  }
}

export const authService = new AuthService()
export default authService