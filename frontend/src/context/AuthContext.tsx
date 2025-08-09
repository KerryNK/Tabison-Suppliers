import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import authService, { AuthUser, LoginCredentials, RegisterData } from '../services/authService';
import { useApi, ApiError } from '../api/client';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  
  // Email authentication
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  
  // Social authentication
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  
  // Phone authentication
  sendOTP: (phoneNumber: string) => Promise<string>;
  verifyOTP: (verificationId: string, code: string) => Promise<void>;
  linkPhoneNumber: (verificationId: string, code: string) => Promise<void>;
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // User management
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (updates: any) => Promise<void>;
  
  // Utilities
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync with backend and get full user data
          const backendUser = await syncWithBackend(firebaseUser);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            phoneNumber: firebaseUser.phoneNumber,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            isAnonymous: firebaseUser.isAnonymous,
            backendUser,
            role: backendUser?.role || 'user'
          });
        } catch (error) {
          console.error('Failed to sync with backend:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            phoneNumber: firebaseUser.phoneNumber,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            isAnonymous: firebaseUser.isAnonymous,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to sync with backend
  const syncWithBackend = async (firebaseUser: any) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Backend sync failed:', error);
      return null;
    }
  };

  // Email authentication
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const authUser = await authService.loginWithEmail(credentials);
      setUser(authUser);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const authUser = await authService.registerWithEmail(data);
      setUser(authUser);
      toast.success('Account created! Please verify your email.');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Social authentication
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const authUser = await authService.loginWithGoogle();
      setUser(authUser);
      toast.success('Successfully logged in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setLoading(true);
      const authUser = await authService.loginWithApple();
      setUser(authUser);
      toast.success('Successfully logged in with Apple!');
    } catch (error: any) {
      toast.error(error.message || 'Apple login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Phone authentication
  const sendOTP = async (phoneNumber: string): Promise<string> => {
    try {
      const verificationId = await authService.sendOTP(phoneNumber);
      toast.success('OTP sent to your phone!');
      return verificationId;
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
      throw error;
    }
  };

  const verifyOTP = async (verificationId: string, code: string) => {
    try {
      setLoading(true);
      const authUser = await authService.verifyOTP(verificationId, code);
      setUser(authUser);
      toast.success('Phone verified successfully!');
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const linkPhoneNumber = async (verificationId: string, code: string) => {
    try {
      await authService.linkPhoneNumber(verificationId, code);
      // Refresh user data
      await refreshUser();
      toast.success('Phone number linked successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to link phone number');
      throw error;
    }
  };

  // Password management
  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  // User management
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error: any) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        const backendUser = await syncWithBackend(auth.currentUser);
        setUser(prev => prev ? { ...prev, backendUser, role: backendUser?.role || 'user' } : null);
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  const updateUserProfile = async (updates: any) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const response = await api.put(`/auth/user/${user.uid}`, updates);
      await refreshUser();
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  // Utility computed values
  const isAuthenticated = !!user && !user.isAnonymous;
  const isEmailVerified = user?.emailVerified || false;
  const isPhoneVerified = user?.backendUser?.phoneVerified || false;
  
  const hasRole = (role: string): boolean => {
    return user?.role === role || user?.backendUser?.role === role;
  };

  const value: AuthContextType = {
    user,
    loading,
    
    // Email authentication
    login,
    register,
    
    // Social authentication
    loginWithGoogle,
    loginWithApple,
    
    // Phone authentication
    sendOTP,
    verifyOTP,
    linkPhoneNumber,
    
    // Password management
    resetPassword,
    
    // User management
    logout,
    refreshUser,
    updateUserProfile,
    
    // Utilities
    isAuthenticated,
    isEmailVerified,
    isPhoneVerified,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for role-based access control
export const withAuth = (WrappedComponent: React.ComponentType<any>, requiredRole?: string) => {
  return (props: any) => {
    const { user, loading, hasRole } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>; // You can replace this with a proper loading component
    }
    
    if (!user) {
      return <div>Please log in to access this page.</div>; // Redirect to login
    }
    
    if (requiredRole && !hasRole(requiredRole)) {
      return <div>You don't have permission to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;
