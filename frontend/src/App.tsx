import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SuppliersPage from "./pages/SuppliersPage";

// Create a client
const queryClient = new QueryClient();

// Simple header without context dependencies

// Simple placeholder components for testing
const ProductsPage: React.FC = () => (
  <div>
    <h1>Products Page</h1>
    <p>This is a placeholder products page.</p>
  </div>
);

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
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </AuthProvider>
          </CartProvider>
        </CustomThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
