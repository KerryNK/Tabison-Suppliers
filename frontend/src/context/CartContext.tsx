import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useApi, ApiError } from '../api/client';
import { Cart, CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemQuantity: (productId: string) => number;
  totalItems: number;
  totalPrice: number;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  const { user } = useAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await api.getCart();
      setCart(cartData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // Cart doesn't exist yet, create empty cart
        setCart({
          _id: '',
          user: user?._id || '',
          items: [],
          totalPrice: 0,
          totalItems: 0,
        });
      } else {
        console.error('Failed to load cart:', error);
        setError('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await api.addToCart(product._id, quantity);
      setCart(updatedCart);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to add item to cart');
      }
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      const updatedCart = await api.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to update cart item');
      }
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);
      const updatedCart = await api.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to remove item from cart');
      }
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await api.clearCart();
      setCart({
        _id: '',
        user: user?._id || '',
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to clear cart');
      }
      throw error;
    }
  };

  const getCartItemQuantity = (productId: string): number => {
    if (!cart) return 0;
    const item = cart.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const clearError = () => {
    setError(null);
  };

  const totalItems = cart?.totalItems || 0;
  const totalPrice = cart?.totalPrice || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getCartItemQuantity,
      totalItems,
      totalPrice,
      error,
      clearError,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
