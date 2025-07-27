export interface Supplier {
  _id: string;
  name: string;
  category: string;
  rating: number;
  city: string;
  county: string;
  logo?: string;
  verified: boolean;
  reviewCount?: number;
}

export interface Product {
  _id: string; // Changed from id for consistency with Supplier
  name: string;
  description: string;
  price: number;
  category: "shoes" | "tech" | "gear";
  image: string;
  inStock: boolean;
  specifications?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
  category: "general" | "shoes" | "tech" | "gear";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}