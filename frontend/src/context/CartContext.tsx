import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
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

const cartReducer = (state: CartState, action: CartAction): CartState => {
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
};

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const setError = (error: string | null) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const setLoading = (loading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: loading });

  const refreshCart = async () => {
    setLoading(true);
    const result = await cartApi.get();
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      dispatch({ type: "SET_CART", payload: { items: [], total: 0 } });
      if (result.error) console.error("Cart fetch error:", result.error);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    setLoading(true);
    const result = await cartApi.addItem(product._id, quantity);
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      setError(result.error || "Failed to add item");
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    const result = await cartApi.removeItem(productId);
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      setError(result.error || "Failed to remove item");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setLoading(true);
    const result = await cartApi.updateQuantity(productId, quantity);
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      setError(result.error || "Failed to update quantity");
    }
  };

  const clearCart = async () => {
    setLoading(true);
    const result = await cartApi.clear();
    if (result.success && result.data) {
      dispatch({ type: "SET_CART", payload: result.data });
    } else {
      setError(result.error || "Failed to clear cart");
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
