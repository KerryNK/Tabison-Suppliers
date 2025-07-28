export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "supplier" | "admin"
  avatar?: string
  verified?: boolean
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  retailPrice: number
  category: string
  type: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  supplier?: Supplier
}

export interface Supplier {
  _id: string
  name: string
  email: string
  phone: string
  category: string
  city: string
  county: string
  description: string
  verified: boolean
  rating: number
  reviewCount: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
