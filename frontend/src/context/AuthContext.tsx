import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useApi, ApiError } from '../api/client';
import { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userData = await api.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          // Not logged in, which is a normal state
          localStorage.removeItem("authToken");
          setUser(null);
        } else {
          console.error('Failed to fetch user profile:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, [api]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await api.login(credentials);
      localStorage.setItem("authToken", response.token);
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during login");
      }
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      const response = await api.register(userData);
      localStorage.setItem("authToken", response.token);
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during registration");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      error, 
      clearError 
    }}>
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
