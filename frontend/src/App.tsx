"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline, Box } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Context Providers
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext"

// Components
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import ErrorBoundary from "./components/ErrorBoundary"

// Pages
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductList from "./pages/ProductList"
import SuppliersPage from "./pages/SuppliersPage"
import SupplierDetailPage from "./pages/SupplierDetailPage"
import CartPage from "./pages/CartPage"
import ContactPage from "./pages/ContactPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import OrdersPage from "./pages/OrdersPage"
import PaymentPage from "./pages/PaymentPage"
import AboutPage from "./pages/AboutPage"
import FAQPage from "./pages/FAQPage"
import TestimonialsPage from "./pages/TestimonialsPage"
import FavoritesPage from "./pages/FavoritesPage"
import AdminProductsPage from "./pages/AdminProductsPage"

// Theme
import theme from "./theme"

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CustomThemeProvider>
            <CssBaseline />
            <AuthProvider>
              <CartProvider>
                <Router>
                  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                    <Routes>
                      {/* Landing Page - No Layout */}
                      <Route path="/landing" element={<LandingPage />} />

                      {/* Main App Routes with Layout */}
                      <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />

                        {/* Public Routes */}
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/:id" element={<ProductList />} />
                        <Route path="suppliers" element={<SuppliersPage />} />
                        <Route path="suppliers/:id" element={<SupplierDetailPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="faq" element={<FAQPage />} />
                        <Route path="testimonials" element={<TestimonialsPage />} />

                        {/* Auth Routes */}
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />

                        {/* Protected Routes */}
                        <Route
                          path="cart"
                          element={
                            <ProtectedRoute>
                              <CartPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="orders"
                          element={
                            <ProtectedRoute>
                              <OrdersPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="payment"
                          element={
                            <ProtectedRoute>
                              <PaymentPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="favorites"
                          element={
                            <ProtectedRoute>
                              <FavoritesPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Admin Routes */}
                        <Route
                          path="admin/products"
                          element={
                            <AdminRoute>
                              <AdminProductsPage />
                            </AdminRoute>
                          }
                        />

                        {/* Terms and Privacy */}
                        <Route
                          path="terms"
                          element={
                            <Box sx={{ p: 4 }}>
                              <h1>Terms of Service</h1>
                              <p>Terms of service content goes here...</p>
                            </Box>
                          }
                        />
                        <Route
                          path="privacy"
                          element={
                            <Box sx={{ p: 4 }}>
                              <h1>Privacy Policy</h1>
                              <p>Privacy policy content goes here...</p>
                            </Box>
                          }
                        />

                        {/* 404 Route */}
                        <Route
                          path="*"
                          element={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: "60vh",
                                textAlign: "center",
                                p: 4,
                              }}
                            >
                              <h1>404 - Page Not Found</h1>
                              <p>The page you're looking for doesn't exist.</p>
                              <button onClick={() => window.history.back()}>Go Back</button>
                            </Box>
                          }
                        />
                      </Route>
                    </Routes>
                  </Box>
                </Router>
              </CartProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
