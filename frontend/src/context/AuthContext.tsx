import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useApi, ApiError } from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // You can add a register function here as well
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userData = await api.get('/auth/profile');
        setUser(userData);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          // Not logged in, which is a normal state
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

  const login = async (email: string, password: string) => {
    const userData = await api.post('/auth/login', { email, password });
    setUser(userData);
  };

  const logout = async () => {
    await api.post('/auth/logout', {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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