import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminGuard from '../guards/AdminGuard';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy-loaded admin pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Products = lazy(() => import('../pages/admin/Products'));
const Orders = lazy(() => import('../pages/admin/Orders'));
const Users = lazy(() => import('../pages/admin/Users'));
const Settings = lazy(() => import('../pages/admin/Settings'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));

const AdminRoutes = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products/*" element={<Products />} />
            <Route path="orders/*" element={<Orders />} />
            <Route path="users/*" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Suspense>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminRoutes;
