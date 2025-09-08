import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard: React.FC = () => {
  // For now, always allow access to protected routes
  // You can implement proper authentication logic here later
  const isAuthenticated = true; // Placeholder - replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
