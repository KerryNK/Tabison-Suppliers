import type { Product, Cart, ContactForm, ApiResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An unknown network error occurred');
  }
  return data;
}

// Product API
export const productApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await handleResponse<Product[]>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" };
    }
  },

  getByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
      const data = await handleResponse<Product[]>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : `Failed to fetch ${category} products` };
    }
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await handleResponse<Product>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to fetch product" };
    }
  },
};

// Cart API
export const cartApi = {
  get: async (): Promise<ApiResponse<Cart>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: "include",
      });
      const data = await handleResponse<Cart>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to fetch cart" };
    }
  },

  addItem: async (productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await handleResponse<Cart>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to add item to cart" };
    }
  },

  removeItem: async (productId: string): Promise<ApiResponse<Cart>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "POST", // Using POST for body compatibility, as DELETE with a body can be problematic.
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const data = await handleResponse<Cart>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to remove item from cart" };
    }
  },
};

// Contact API
export const contactApi = {
  submit: async (formData: ContactForm): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await handleResponse<{ message: string }>(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to submit contact form" };
    }
  },
};
        