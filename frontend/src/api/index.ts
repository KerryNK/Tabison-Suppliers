import { useApi } from "./client"
import type { Product, Cart, ContactForm, ApiResponse } from "../types"

// Products API
export const productsApi = {
  getAll: async (params?: {
    category?: string
    search?: string
    sort?: string
    minPrice?: number
    maxPrice?: number
    tag?: string
  }): Promise<ApiResponse<Product[]>> => {
    const api = useApi()
    try {
      const queryParams = new URLSearchParams()
      if (params?.category && params.category !== "All") {
        queryParams.append("category", params.category)
      }
      if (params?.search) queryParams.append("search", params.search)
      if (params?.sort) queryParams.append("sort", params.sort)
      if (params?.minPrice) queryParams.append("minPrice", params.minPrice.toString())
      if (params?.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString())
      if (params?.tag && params.tag !== "All") queryParams.append("tag", params.tag)

      const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const data = await api.get(url)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const api = useApi()
    try {
      const data = await api.get(`/products/${id}`)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  addReview: async (productId: string, review: { rating: number; comment: string }): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.post(`/products/${productId}/reviews`, review)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}

// Cart API
export const cartApi = {
  get: async (): Promise<ApiResponse<Cart>> => {
    const api = useApi()
    try {
      const data = await api.get("/cart")
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  addItem: async (productId: string, quantity = 1): Promise<ApiResponse<Cart>> => {
    const api = useApi()
    try {
      const data = await api.post("/cart/add", { productId, quantity })
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  removeItem: async (productId: string): Promise<ApiResponse<Cart>> => {
    const api = useApi()
    try {
      const data = await api.delete(`/cart/items/${productId}`)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  updateQuantity: async (productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    const api = useApi()
    try {
      const data = await api.put(`/cart/items/${productId}`, { quantity })
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  clear: async (): Promise<ApiResponse<Cart>> => {
    const api = useApi()
    try {
      const data = await api.delete("/cart")
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}

// Contact API
export const contactApi = {
  submit: async (formData: ContactForm): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.post("/contact", formData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}

// Suppliers API
export const suppliersApi = {
  getAll: async (params?: {
    search?: string
    category?: string
    location?: string
    limit?: number
  }): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append("q", params.search)
      if (params?.category && params.category !== "All Categories") {
        queryParams.append("category", params.category)
      }
      if (params?.location && params.location !== "All Locations") {
        queryParams.append("location", params.location)
      }
      if (params?.limit) queryParams.append("limit", params.limit.toString())

      const url = `/suppliers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const data = await api.get(url)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.get(`/suppliers/${id}`)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}
