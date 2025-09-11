// src/App.tsx
import * as React from "react"
import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"

// Contexts
import { CustomThemeProvider } from "./context/ThemeContext"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"

// Layout & Guards
import Layout from "./components/Layout"
import AuthGuard from "./components/AuthGuard"
import AdminRoutes from "./routes/AdminRoutes"

// Pages
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
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
import OrderDetailPage from "./pages/OrderDetailPage"
import ProfilePage from "./pages/ProfilePage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import BlogPage from "./pages/BlogPage"
import NotFoundPage from "./pages/NotFoundPage"

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
              <Routes>
                {/* Auth routes (standalone, no Layout) */}
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
                <Route path="/forgot-password" element={<AuthPage mode="forgot-password" />} />

                {/* Main app routes wrapped with Layout */}
                <Route element={<Layout />}>
                  {/* Public */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/request-quote" element={<RequestQuotePage />} />

                  {/* Protected */}
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

                  {/* Admin */}
                  <Route path="/admin/*" element={<AdminRoutes />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </AuthProvider>
          </CartProvider>
        </CustomThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
