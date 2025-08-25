import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import { UserProfile, Cart, Product } from '../types';

interface AppState {
  menuOpen: boolean;
  user: UserProfile | null;
  cart: Cart | null;
  wishlist: Product[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'TOGGLE_MENU' }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

const initialState: AppState = {
  menuOpen: false,
  user: null,
  cart: null,
  wishlist: [],
  notifications: [],
  theme: 'light',
  loading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}>({
  state: initialState,
  dispatch: () => null,
  addNotification: () => null,
  removeNotification: () => null,
  setLoading: () => null,
  setError: () => null,
});

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, menuOpen: !state.menuOpen };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { ...notification, id },
      });

      if (notification.duration !== 0) {
        setTimeout(() => {
          dispatch({
            type: 'REMOVE_NOTIFICATION',
            payload: id,
          });
        }, notification.duration || 5000);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addNotification,
        removeNotification,
        setLoading,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
