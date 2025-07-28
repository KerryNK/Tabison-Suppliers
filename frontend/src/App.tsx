"use client"

import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CustomThemeProvider } from "./context/ThemeContext"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "react-hot-toast"
import { ErrorBoundary } from "react-error-boundary"

import Layout from "./components/Layout"
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage"
import SuppliersPage from "./pages/SuppliersPage"
import ProductsPage from "./pages/ProductsPage"
import ContactPage from "./pages/ContactPage"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div
    style={{
      padding: "20px",
      textAlign: "center",
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <h2>Something went wrong:</h2>
    <pre style={{ color: "red", margin: "20px 0" }}>{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4fd1c5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Try again
    </button>
  </div>
)

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <CustomThemeProvider>
            <CartProvider>
              <AuthProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                    success: {
                      style: {
                        background: "#4fd1c5",
                        color: "#1a202c",
                      },
                    },
                    error: {
                      style: {
                        background: "#f56565",
                        color: "#fff",
                      },
                    },
                  }}
                />
                <Routes>
                  {/* Landing page route */}
                  <Route path="/landing" element={<LandingPage />} />

                  {/* Main app routes with layout */}
                  <Route
                    path="/*"
                    element={
                      <Layout>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/suppliers" element={<SuppliersPage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                      </Layout>
                    }
                  />
                </Routes>
              </AuthProvider>
            </CartProvider>
          </CustomThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
