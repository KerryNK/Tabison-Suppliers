import { useApi } from "./client"

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  images: string[]
  inStock: boolean
  stockQuantity: number
  supplier: string
  rating: number
  reviews: Review[]
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface Review {
  _id: string
  user: string
  rating: number
  comment: string
  createdAt: string
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

interface CartResponse {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product
  quantity: number
  price: number
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Products API
export const productsApi = {
  getAll: async (params?: {
    category?: string
    search?: string
    sort?: string
    minPrice?: number
    maxPrice?: number
    tag?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{ products: Product[]; total: number; page: number; pages: number }>> => {
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
      if (params?.page) queryParams.append("page", params.page.toString())
      if (params?.limit) queryParams.append("limit", params.limit.toString())

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

  addReview: async (productId: string, review: { rating: number; comment: string }): Promise<ApiResponse<Product>> => {
    const api = useApi()
    try {
      const data = await api.post(`/products/${productId}/reviews`, review)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  create: async (productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const api = useApi()
    try {
      const data = await api.post("/products", productData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  update: async (id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const api = useApi()
    try {
      const data = await api.put(`/products/${id}`, productData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const api = useApi()
    try {
      await api.delete(`/products/${id}`)
      return { success: true }
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
  submit: async (formData: ContactForm): Promise<ApiResponse<{ message: string }>> => {
    const api = useApi()
    try {
      const data = await api.post("/contact", formData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  getAll: async (): Promise<ApiResponse<ContactForm[]>> => {
    const api = useApi()
    try {
      const data = await api.get("/contact")
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
    page?: number
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
      if (params?.page) queryParams.append("page", params.page.toString())

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

  create: async (supplierData: any): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.post("/suppliers", supplierData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  update: async (id: string, supplierData: any): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.put(`/suppliers/${id}`, supplierData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const api = useApi()
    try {
      await api.delete(`/suppliers/${id}`)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}

// Orders API
export const ordersApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const api = useApi()
    try {
      const data = await api.get("/orders")
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.get(`/orders/${id}`)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  create: async (orderData: any): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.post("/orders", orderData)
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    const api = useApi()
    try {
      const data = await api.put(`/orders/${id}/status`, { status })
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}
