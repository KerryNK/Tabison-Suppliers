import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode,
} from "react";
import type { Product } from "../types";
import { useApi } from "../api/client";

interface WishlistState {
    items: Product[];
    loading: boolean;
    error: string | null;
}

type WishlistAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_WISHLIST"; payload: Product[] }
    | { type: "SET_ERROR"; payload: string | null };

const initialState: WishlistState = {
    items: [],
    loading: true,
    error: null,
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_WISHLIST":
            return { ...state, items: action.payload, loading: false, error: null };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

interface WishlistContextType extends WishlistState {
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(wishlistReducer, initialState);
    const api = useApi();

    const setError = (error: string | null) =>
        dispatch({ type: "SET_ERROR", payload: error });

    const setLoading = (loading: boolean) =>
        dispatch({ type: "SET_LOADING", payload: loading });

    const refreshWishlist = async () => {
        setLoading(true);
        try {
            const data = await api.get("/wishlist");
            dispatch({ type: "SET_WISHLIST", payload: data.products || [] });
        } catch (error: any) {
            console.error("Wishlist fetch error:", error);
            dispatch({ type: "SET_WISHLIST", payload: [] });
        }
    };

    const addToWishlist = async (productId: string) => {
        setLoading(true);
        try {
            const data = await api.post("/wishlist", { productId });
            dispatch({ type: "SET_WISHLIST", payload: data.products || [] });
        } catch (error: any) {
            setError(error.message || "Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId: string) => {
        setLoading(true);
        try {
            const data = await api.delete(`/wishlist/${productId}`);
            dispatch({ type: "SET_WISHLIST", payload: data.products || [] });
        } catch (error: any) {
            setError(error.message || "Failed to remove from wishlist");
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return state.items.some((item) => item._id === productId);
    };

    useEffect(() => {
        refreshWishlist();
    }, []);

    return (
        <WishlistContext.Provider
            value={{
                ...state,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
    return context;
};
