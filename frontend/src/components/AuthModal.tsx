import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { RecaptchaVerifier } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'otp' | 'forgot-password';
}

type AuthMode = 'login' | 'register' | 'otp' | 'forgot-password';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: '',
  });
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  
  const {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    sendOTP,
    verifyOTP,
    resetPassword,
    loading,
    otpSent,
  } = useAuth();

  useEffect(() => {
    if (isOpen && mode === 'otp') {
      // Initialize reCAPTCHA verifier for OTP
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
      setRecaptchaVerifier(verifier);
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [isOpen, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      switch (mode) {
        case 'register':
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          await signUpWithEmail(formData.email, formData.password, formData.name);
          onClose();
          break;

        case 'login':
          await signInWithEmail(formData.email, formData.password);
          onClose();
          break;

        case 'otp':
          if (otpSent) {
            await verifyOTP(formData.otp);
            onClose();
          } else if (recaptchaVerifier) {
            await sendOTP(formData.phone, recaptchaVerifier);
          }
          break;

        case 'forgot-password':
          await resetPassword(formData.email);
          setMode('login');
          break;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      onClose();
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-brand-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-95 opacity-0 animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-gray-light">
          <h2 className="text-2xl font-bold text-brand-black">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'otp' && 'Phone Verification'}
            {mode === 'forgot-password' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Social Login Buttons */}
          {(mode === 'login' || mode === 'register') && (
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-brand-gray-light rounded-lg hover:bg-brand-gray-bg transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-brand-black text-brand-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-gray-light"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-brand-white text-gray-500">or</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register Fields */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {/* Phone Field */}
            {mode === 'otp' && (
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>
            )}

            {/* OTP Field */}
            {mode === 'otp' && otpSent && (
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>
            )}

            {/* Password Fields */}
            {(mode === 'login' || mode === 'register') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-brand-gray-light rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-teal text-brand-white py-3 rounded-lg font-semibold hover:bg-brand-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-brand-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'otp' && (otpSent ? 'Verify Code' : 'Send Code')}
                  {mode === 'forgot-password' && 'Send Reset Email'}
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => setMode('forgot-password')}
                  className="text-brand-teal hover:text-brand-teal-dark text-sm font-medium"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-brand-teal hover:text-brand-teal-dark font-medium"
                  >
                    Sign up
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Or{' '}
                  <button
                    onClick={() => setMode('otp')}
                    className="text-brand-teal hover:text-brand-teal-dark font-medium"
                  >
                    sign in with phone
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-brand-teal hover:text-brand-teal-dark font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {(mode === 'forgot-password' || mode === 'otp') && (
              <button
                onClick={() => setMode('login')}
                className="text-brand-teal hover:text-brand-teal-dark text-sm font-medium"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default AuthModal;