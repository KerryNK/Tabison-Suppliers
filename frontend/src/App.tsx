import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CustomThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import HomePage from "./pages/HomePage";
import SuppliersPage from "./pages/SuppliersPage";

// Create a client
const queryClient = new QueryClient();

// Simple header without context dependencies
const SimpleHeader: React.FC = () => (
  <AppBar position="fixed">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Tabison Suppliers
      </Typography>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/suppliers">Suppliers</Button>
      <Button color="inherit" component={Link} to="/products">Products</Button>
    </Toolbar>
  </AppBar>
);

// Simple layout component
const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ minHeight: "100vh" }}>
    <SimpleHeader />
    <Toolbar /> {/* Spacer for fixed header */}
    <Box sx={{ padding: 2 }}>
      {children}
    </Box>
  </Box>
);

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
              <SimpleLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </SimpleLayout>
            </AuthProvider>
          </CartProvider>
        </CustomThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
