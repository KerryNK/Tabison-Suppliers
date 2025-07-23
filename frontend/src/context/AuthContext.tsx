import React, { createContext, useContext, useState } from "react";

type User = { id: string; username: string; email: string; role: string };
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 