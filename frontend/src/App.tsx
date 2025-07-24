import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SuppliersPage from "./pages/SuppliersPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import TestimonialsPage from './pages/TestimonialsPage';
import { HelmetProvider } from 'react-helmet-async';
import ChatWidget from './components/ChatWidget';
import PushNotifications from './components/PushNotifications';
import { CustomThemeProvider } from './context/ThemeContext';

const App: React.FC = () => (
  <HelmetProvider>
    <CustomThemeProvider>
      <CartProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/suppliers/*" element={<SuppliersPage />} />
              <Route path="/products/*" element={<ProductsPage />} />
              <Route path="/orders/*" element={<OrdersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
            <ChatWidget />
            <PushNotifications />
          </Layout>
        </AuthProvider>
      </CartProvider>
    </CustomThemeProvider>
  </HelmetProvider>
);

export default App;
