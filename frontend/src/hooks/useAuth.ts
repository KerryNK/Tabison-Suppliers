import { useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  onAuthStateChanged,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, appleProvider, db } from '../config/firebase';
import toast from 'react-hot-toast';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  role: 'client' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const createUserProfile = async (user: User, additionalData: Partial<UserProfile> = {}) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const { displayName, email, photoURL, phoneNumber } = user;
      const profile: UserProfile = {
        uid: user.uid,
        displayName,
        email,
        photoURL,
        phoneNumber,
        role: 'client',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        ...additionalData,
      };

      try {
        await setDoc(userDocRef, profile);
        setUserProfile(profile);
        return profile;
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    } else {
      // Update last login time
      await setDoc(userDocRef, { lastLoginAt: new Date() }, { merge: true });
      const existingProfile = userDoc.data() as UserProfile;
      setUserProfile(existingProfile);
      return existingProfile;
    }
  };

  // Email/Password Authentication
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(user, { displayName });
      
      // Create user profile in Firestore
      await createUserProfile(user, { displayName });
      
      toast.success('Account created successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfile(user);
      toast.success('Signed in successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { user } = await signInWithPopup(auth, googleProvider);
      await createUserProfile(user);
      toast.success('Signed in with Google successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Apple Authentication
  const signInWithApple = async () => {
    try {
      setLoading(true);
      const { user } = await signInWithPopup(auth, appleProvider);
      await createUserProfile(user);
      toast.success('Signed in with Apple successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Apple');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Phone/OTP Authentication
  const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    try {
      setLoading(true);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmationResult);
      setOtpSent(true);
      toast.success('OTP sent successfully!');
      return confirmationResult;
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!confirmationResult) {
      throw new Error('No confirmation result available');
    }

    try {
      setLoading(true);
      const { user } = await confirmationResult.confirm(otp);
      await createUserProfile(user);
      setOtpSent(false);
      setConfirmationResult(null);
      toast.success('Phone number verified successfully!');
      return user;
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setOtpSent(false);
      setConfirmationResult(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  return {
    user,
    userProfile,
    loading,
    otpSent,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    sendOTP,
    verifyOTP,
    resetPassword,
    logout,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
  };
};