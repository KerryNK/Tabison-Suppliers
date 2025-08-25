// Core service interfaces for Tabison Suppliers
export interface AuthenticationService {
  // Social Auth
  signInWithGoogle(): Promise<UserResponse>;
  signInWithApple(): Promise<UserResponse>;
  
  // Email + Phone Auth
  signInWithEmail(email: string, password: string): Promise<UserResponse>;
  signUpWithEmail(email: string, password: string, userData: UserData): Promise<UserResponse>;
  verifyPhoneNumber(phoneNumber: string): Promise<{ verificationId: string }>;
  confirmOTP(verificationId: string, code: string): Promise<UserResponse>;
  
  // Password Management
  resetPassword(email: string): Promise<void>;
  updatePassword(oldPassword: string, newPassword: string): Promise<void>;
  
  // Session Management
  refreshToken(): Promise<string>;
  logout(): Promise<void>;
}

export interface UserService {
  // Profile Management
  getCurrentUser(): Promise<UserProfile>;
  updateProfile(data: Partial<UserProfile>): Promise<UserProfile>;
  updateAvatar(file: File): Promise<string>;
  
  // Admin User Management
  getAllUsers(params: UserQueryParams): Promise<PaginatedResponse<UserProfile>>;
  getUserById(id: string): Promise<UserProfile>;
  updateUserRole(id: string, role: UserRole): Promise<UserProfile>;
  deactivateUser(id: string): Promise<void>;
}

export interface ProductService {
  // Product Management
  getAllProducts(params: ProductQueryParams): Promise<PaginatedResponse<Product>>;
  getProductById(id: string): Promise<Product>;
  createProduct(data: CreateProductData): Promise<Product>;
  updateProduct(id: string, data: UpdateProductData): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Product Images
  uploadProductImages(id: string, files: File[]): Promise<string[]>;
  deleteProductImage(id: string, imageUrl: string): Promise<void>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  createCategory(data: CreateCategoryData): Promise<Category>;
  updateCategory(id: string, data: UpdateCategoryData): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}

export interface OrderService {
  // Order Management
  createOrder(data: CreateOrderData): Promise<Order>;
  getOrderById(id: string): Promise<Order>;
  getAllOrders(params: OrderQueryParams): Promise<PaginatedResponse<Order>>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  
  // Order Processing
  generateOrderReceipt(id: string): Promise<{ pdfUrl: string }>;
  sendOrderConfirmation(id: string): Promise<void>;
  
  // Payment Processing
  processPayment(orderId: string, paymentData: PaymentData): Promise<PaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserResponse {
  user: UserProfile;
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'client';
export type UserStatus = 'active' | 'inactive' | 'blocked';

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  variants?: ProductVariant[];
  attributes: Record<string, string>;
  stock: number;
  sku: string;
  status: ProductStatus;
  seo: SEOData;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export type ProductStatus = 'active' | 'draft' | 'outOfStock';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  attributes?: Record<string, string>;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card' | 'paypal';

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

// Query Parameters
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface UserQueryParams extends BaseQueryParams {
  role?: UserRole;
  status?: UserStatus;
}

export interface ProductQueryParams extends BaseQueryParams {
  category?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderQueryParams extends BaseQueryParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
}
