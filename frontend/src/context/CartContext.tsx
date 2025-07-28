// CartContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { Cart, Product } from "../types";
import { cartApi } from "../api";

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: CartState = {
  cart: { items: [], total: 0 },
  loading: true,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

type CartContextType = CartState & {
  addToCart: (product: Product, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const result = await cartApi.get();
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      dispatch({ type: "SET_CART", payload: { items: [], total: 0 } });
      if (result.error) console.error("Failed to refresh cart:", result.error);
    }
  };

  const addToCart = async (product: Product, qty = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const result = await cartApi.addItem(product._id, qty);
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      dispatch({ type: "SET_ERROR", payload: result.error || "Add to cart failed" });
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const result = await cartApi.removeItem(productId);
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      dispatch({ type: "SET_ERROR", payload: result.error || "Remove item failed" });
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
