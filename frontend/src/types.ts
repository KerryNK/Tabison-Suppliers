export interface Supplier {
  _id: string
  name: string
  category: string
  rating: number
  city: string
  county: string
  logo?: string
  verified: boolean
  reviewCount?: number
  description?: string
  specialties?: string[]
  contactInfo?: {
    email?: string
    phone?: string
    website?: string
  }
  businessHours?: {
    [key: string]: string
  }
  certifications?: string[]
  establishedYear?: number
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  retailPrice: number
  category: "shoes" | "tech" | "gear" | "bags" | "accessories" | "clothing" | "general"
  type: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  specifications?: Record<string, string>
  features?: string[]
  tags?: string[]
  reviews?: ProductReview[]
  costBreakdown?: Record<string, any>
  supplier?: Supplier
  createdAt?: string
  updatedAt?: string
}

export interface ProductReview {
  _id: string
  user: {
    _id: string
    username: string
    name: string
  }
  rating: number
  comment: string
  date: string
  helpful?: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedOptions?: Record<string, any>
}

export interface Cart {
  items: CartItem[]
  total: number
  subtotal?: number
  tax?: number
  shipping?: number
  itemCount?: number
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  category: "general" | "shoes" | "tech" | "gear" | "support" | "partnership"
  urgency?: "low" | "medium" | "high"
}

export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "supplier" | "admin"
  avatar?: string
  verified?: boolean
  preferences?: {
    notifications: boolean
    newsletter: boolean
    theme: "light" | "dark"
  }
  profile?: {
    company?: string
    position?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      county?: string
      country?: string
    }
  }
}

export interface Order {
  _id: string
  user: User
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    street: string
    city: string
    county: string
    country: string
    phone: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface SearchFilters {
  category?: string
  location?: string
  priceRange?: [number, number]
  rating?: number
  verified?: boolean
  tags?: string[]
  sortBy?: "name" | "price" | "rating" | "newest" | "popular"
  sortOrder?: "asc" | "desc"
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  orderUpdates: boolean
  promotions: boolean
  newsletter: boolean
}

export interface Theme {
  mode: "light" | "dark"
  primaryColor: string
  secondaryColor: string
}
