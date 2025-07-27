import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CustomThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

// Create a client
const queryClient = new QueryClient();

// Simplified Auth Context for testing
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

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
const HomePage: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>Home Page</h1>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Test useState</button>
    </div>
  );
};

const SuppliersPage: React.FC = () => (
  <div>
    <h1>Suppliers Page</h1>
    <p>This is a placeholder suppliers page.</p>
  </div>
);

const ProductsPage: React.FC = () => (
  <div>
    <h1>Products Page</h1>
    <p>This is a placeholder products page.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <CartProvider>
          <SimpleAuthProvider>
            <SimpleLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </SimpleLayout>
          </SimpleAuthProvider>
        </CartProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
