import axios, { type AxiosInstance, type AxiosResponse } from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

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
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("authToken")
          window.location.href = "/login"
        }
        return Promise.reject(error)
      },
    )
  }

  // Generic request methods
  async get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.client.get(url, { params })
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post(url, data)
  }

  async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put(url, data)
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete(url)
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post("/auth/login", { email, password })
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.post("/auth/register", userData)
  }

  async getCurrentUser() {
    return this.get("/auth/me")
  }

  // Product methods
  async getProducts(params?: { page?: number; limit?: number; search?: string; category?: string }) {
    return this.get("/products", params)
  }

  async getProduct(id: string) {
    return this.get(`/products/${id}`)
  }

  // Supplier methods
  async getSuppliers(params?: { category?: string; location?: string; verified?: boolean }) {
    return this.get("/suppliers/search", params)
  }

  async getSupplier(id: string) {
    return this.get(`/suppliers/${id}`)
  }

  // Cart methods
  async getCart() {
    return this.get("/cart")
  }

  async addToCart(productId: string, quantity: number) {
    return this.post("/cart/add", { productId, quantity })
  }

  // Contact methods
  async submitContact(contactData: { name: string; email: string; subject: string; message: string }) {
    return this.post("/contact", contactData)
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

export default apiClient

// Hook for using the API client in React components
export const useApi = () => {
  return apiClient
}
