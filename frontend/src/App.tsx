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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
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


