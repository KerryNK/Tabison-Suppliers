import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
