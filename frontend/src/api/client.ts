import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://suppliers-7zjy.onrender.com',
  timeout: 10000,
});

export interface Product {
  _id: string;
  name: string;
  price: { wholesale: number; retail: number };
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await API.get('/api/products');
    return data.products || data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

export const createOrder = async (orderData: { productId: string; quantity: number }) => {
  try {
    await API.post('/api/orders', orderData);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}; 