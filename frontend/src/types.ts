export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "supplier" | "admin"
  avatar?: string
  verified?: boolean
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
  preferences?: {
    notifications: boolean
    newsletter: boolean
    theme: "light" | "dark"
  }
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  retailPrice: number
  category: "military" | "safety" | "official" | "industrial" | "security" | "professional"
  type: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  specifications?: Map<string, string>
  features?: string[]
  tags?: string[]
  supplier?: Supplier
  reviews?: Review[]
  averageRating: number
  numReviews: number
}

export interface Review {
  _id: string
  user: User
  rating: number
  comment: string
  date: Date
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

export interface CartItem {
  _id: string
  product: Product
  quantity: number
  price: number
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

export interface OrderItem {
  name: string
  qty: number
  image: string
  price: number
  product: string
}

export interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export interface PaymentResult {
  id?: string
  status?: string
  update_time?: string
  email_address?: string
  phoneNumber?: string
  transactionId?: string
  amount?: number
}

export interface Order {
  _id: string
  user: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: "mpesa" | "paypal" | "card"
  paymentResult?: PaymentResult
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  status: "pending" | "processing" | "paid" | "shipped" | "delivered" | "cancelled"
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  trackingNumber?: string
  notes?: string
  adminNotes?: string
  estimatedDelivery?: Date
  orderNumber: string
  createdAt: Date
  updatedAt: Date
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category: "delivery" | "payments" | "account" | "products" | "general"
  isActive: boolean
  order: number
  createdBy: User
  updatedBy?: User
  createdAt: Date
  updatedAt: Date
}

export interface PaymentStatus {
  orderId: string
  orderNumber: string
  paymentStatus: string
  isPaid: boolean
  paidAt?: Date
  totalAmount: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pages: number
  total: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}
