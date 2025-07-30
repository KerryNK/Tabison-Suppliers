import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import { 
  User, 
  Product, 
  Supplier, 
  Order, 
  FAQ, 
  Cart, 
  PaymentStatus,
  LoginCredentials,
  RegisterData,
  ContactForm,
  PaginatedResponse
} from "../types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Custom error class for API errors
export class ApiError extends Error {
  public status: number
  public data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem("authToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("authToken")
          window.location.href = "/login"
        }

        // Create custom ApiError
        const apiError = new ApiError(
          error.response?.data?.message || error.message,
          error.response?.status || 500,
          error.response?.data,
        )

        return Promise.reject(apiError)
      },
    )
  }

  // Generic request methods
  async get<T>(url: string, params?: any): Promise<T> {
    return this.client.get(url, { params })
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data)
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data)
  }

  async delete<T>(url: string): Promise<T> {
    return this.client.delete(url)
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return this.post("/auth/login", credentials)
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    return this.post("/auth/register", userData)
  }

  async getCurrentUser(): Promise<User> {
    return this.get("/auth/profile")
  }

  async logout(): Promise<void> {
    return this.post("/auth/logout")
  }

  // Product methods
  async getProducts(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Product>> {
    return this.get("/products", params)
  }

  async getProduct(id: string): Promise<Product> {
    return this.get(`/products/${id}`)
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return this.post("/products", productData)
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return this.put(`/products/${id}`, productData)
  }

  async deleteProduct(id: string): Promise<void> {
    return this.delete(`/products/${id}`)
  }

  // Supplier methods
  async getSuppliers(params?: { 
    category?: string; 
    location?: string; 
    verified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Supplier>> {
    return this.get("/suppliers", params)
  }

  async getSupplier(id: string): Promise<Supplier> {
    return this.get(`/suppliers/${id}`)
  }

  // Cart methods
  async getCart(): Promise<Cart> {
    return this.get("/cart")
  }

  async addToCart(productId: string, quantity: number): Promise<Cart> {
    return this.post("/cart/add", { productId, quantity })
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    return this.put(`/cart/${itemId}`, { quantity })
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    return this.delete(`/cart/${itemId}`)
  }

  async clearCart(): Promise<void> {
    return this.delete("/cart")
  }

  // Order methods
  async createOrder(orderData: {
    orderItems: any[];
    shippingAddress: any;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }): Promise<Order> {
    return this.post("/orders", orderData)
  }

  async getOrders(params?: { 
    page?: number; 
    limit?: number; 
    status?: string;
  }): Promise<PaginatedResponse<Order>> {
    return this.get("/orders", params)
  }

  async getOrder(id: string): Promise<Order> {
    return this.get(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.put(`/orders/${id}/status`, { status })
  }

  // Payment methods
  async initiateMpesaPayment(data: {
    phoneNumber: string;
    amount: number;
    orderId: string;
  }): Promise<{ success: boolean; checkoutRequestID: string; message: string }> {
    return this.post("/payments/mpesa/stk-push", data)
  }

  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    return this.get(`/payments/status/${orderId}`)
  }

  async processPayPalPayment(data: {
    orderId: string;
    paymentId: string;
    payerId: string;
  }): Promise<{ success: boolean; message: string; orderNumber: string }> {
    return this.post("/payments/paypal", data)
  }

  // FAQ methods
  async getFAQs(params?: { 
    page?: number; 
    limit?: number; 
    keyword?: string;
    category?: string;
  }): Promise<PaginatedResponse<FAQ>> {
    return this.get("/faqs", params)
  }

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return this.get(`/faqs/category/${category}`)
  }

  async getFAQ(id: string): Promise<FAQ> {
    return this.get(`/faqs/${id}`)
  }

  async createFAQ(faqData: {
    question: string;
    answer: string;
    category: string;
    order?: number;
  }): Promise<FAQ> {
    return this.post("/faqs", faqData)
  }

  async updateFAQ(id: string, faqData: Partial<FAQ>): Promise<FAQ> {
    return this.put(`/faqs/${id}`, faqData)
  }

  async deleteFAQ(id: string): Promise<void> {
    return this.delete(`/faqs/${id}`)
  }

  // Contact methods
  async submitContact(contactData: ContactForm): Promise<{ success: boolean; message: string }> {
    return this.post("/contact", contactData)
  }

  // Admin methods
  async getAdminStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
  }> {
    return this.get("/admin/stats")
  }

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaginatedResponse<Order>> {
    return this.get("/admin/orders", params)
  }

  async updateOrderTracking(id: string, trackingData: {
    trackingNumber: string;
    status: string;
    adminNotes?: string;
  }): Promise<Order> {
    return this.put(`/admin/orders/${id}/tracking`, trackingData)
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

export default apiClient

// Hook for using the API client in React components
export const useApi = () => {
  return apiClient
}
