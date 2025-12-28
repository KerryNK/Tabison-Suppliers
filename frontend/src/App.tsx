import * as React from "react"
import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"

import { CustomThemeProvider } from "./context/ThemeContext"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { WishlistProvider } from "./context/WishlistContext"

import Layout from "./components/Layout"

// Pages
import HomePage from "./pages/HomePage"
import SuppliersPage from "./pages/SuppliersPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import PaymentPage from "./pages/PaymentPage"
import OrdersPage from "./pages/OrdersPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import FavoritesPage from "./pages/FavoritesPage"
import TrackOrderPage from "./pages/TrackOrderPage"
import SettingsPage from "./pages/SettingsPage"
import RequestQuotePage from "./pages/RequestQuotePage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"
import AuthPage from "./pages/authPage"

// Components
import AuthGuard from "./components/AuthGuard"

// Routes
import AdminRoutes from "./routes/AdminRoutes"

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
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/request-quote" element={<RequestQuotePage />} />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/register" element={<AuthPage mode="register" />} />
                    <Route path="/forgot-password" element={<AuthPage mode="forgot-password" />} />

                    {/* Protected Routes */}
                    <Route element={<AuthGuard />}>
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/orders/:id" element={<OrderConfirmationPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/track-order" element={<TrackOrderPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminRoutes />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
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
