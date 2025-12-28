import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied for non-admin users
  if (user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>🔒 Access Denied</h1>
        <p>You don't have permission to access the admin panel.</p>
        <p>This area is restricted to administrators only.</p>
        <a href="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
          ← Go to Home
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;

