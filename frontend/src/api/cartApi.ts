// frontend/src/api/cartApi.ts
import axios from "axios";
const BASE_URL = "/api/cart";

export const cartApi = {
  get: async () => {
    try {
      const res = await axios.get(BASE_URL);
      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  addItem: async (productId: string, quantity: number) => {
    try {
      const res = await axios.post(BASE_URL, { productId, quantity });
      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  removeItem: async (productId: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${productId}`);
      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  updateQuantity: async (productId: string, quantity: number) => {
    try {
      const res = await axios.patch(`${BASE_URL}/${productId}`, { quantity });
      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  clear: async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/clear`);
      return { success: true, data: res.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
