import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { Helmet } from "react-helmet-async"
import { Toaster } from "react-hot-toast"

// Providers
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext"

// Pages
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import SuppliersPage from "./pages/SuppliersPage"
import ContactPage from "./pages/ContactPage"
import AboutPage from "./pages/AboutPage"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import OrdersPage from "./pages/OrdersPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import FAQPage from "./pages/FAQPage"
import ProfilePage from "./pages/ProfilePage"

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProductsPage from "./pages/admin/AdminProductsPage"
import AdminOrdersPage from "./pages/admin/AdminOrdersPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"
import AdminFAQsPage from "./pages/admin/AdminFAQsPage"

// Components
import Layout from "./components/Layout"
import ErrorBoundary from "./components/ErrorBoundary"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CustomThemeProvider>
            <AuthProvider>
              <CartProvider>
                <CssBaseline />
                <Helmet>
                  <title>Tabison Suppliers - Military, Safety & Professional Footwear</title>
                  <meta
                    name="description"
                    content="Leading supplier of military boots, safety footwear, and professional equipment in Kenya. Quality products for military, police, and industrial use."
                  />
                </Helmet>

                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders/:id" element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-confirmation/:id" element={
                      <ProtectedRoute>
                        <OrderConfirmationPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminRoute>
                        <AdminProductsPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <AdminRoute>
                        <AdminOrdersPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                      <AdminRoute>
                        <AdminUsersPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/faqs" element={
                      <AdminRoute>
                        <AdminFAQsPage />
                      </AdminRoute>
                    } />

                    {/* 404 Route */}
                    <Route
                      path="*"
                      element={
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                          <h1>404 - Page Not Found</h1>
                          <p>The page you are looking for does not exist.</p>
                        </div>
                      }
                    />
                  </Routes>
                </Layout>

                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />

                <ReactQueryDevtools initialIsOpen={false} />
              </CartProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
