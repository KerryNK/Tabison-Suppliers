import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"

import { CustomThemeProvider } from "./context/ThemeContext"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"

import Layout from "./components/Layout"

// Pages
import HomePage from "./pages/HomePage"
import SuppliersPage from "./pages/SuppliersPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import PaymentPage from "./pages/PaymentPage"
import OrdersPage from "./pages/OrdersPage"
import FavoritesPage from "./pages/FavoritesPage"
import AdminProductsPage from "./pages/AdminProductsPage"
import TrackOrderPage from "./pages/TrackOrderPage"
import SettingsPage from "./pages/SettingsPage"
import RequestQuotePage from "./pages/RequestQuotePage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <CustomThemeProvider>
          <CartProvider>
            <AuthProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/login" element={<AuthPage mode="login" />} />
                  <Route path="/register" element={<AuthPage mode="register" />} />
                  <Route path="/forgot-password" element={<AuthPage mode="forgot-password" />} />
                  
                  {/* Protected Routes */}
                  <Route element={<AuthGuard />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<AdminRoutes />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/request-quote" element={<RequestQuotePage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </AuthProvider>
          </CartProvider>
        </CustomThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App


