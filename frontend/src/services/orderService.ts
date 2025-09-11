import api from '../api/client';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'mpesa' | 'card' | 'paypal';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: Order['shippingAddress'];
  paymentMethod: Order['paymentMethod'];
  notes?: string;
}

export interface OrderFilters {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class OrderService {
  async getAllOrders(filters?: OrderFilters): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { data } = await api.get('/orders', { params: filters });
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async createOrder(orderData: OrderCreateData): Promise<Order> {
    try {
      const { data } = await api.post('/orders', orderData);
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updateShippingInfo(
    orderId: string,
    shippingInfo: {
      trackingNumber?: string;
      estimatedDeliveryDate?: string;
      shippingAddress?: Partial<Order['shippingAddress']>;
    }
  ): Promise<Order> {
    try {
      const { data } = await api.put(`/orders/${orderId}/shipping`, shippingInfo);
      return data;
    } catch (error) {
      console.error('Error updating shipping info:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const { data } = await api.post(`/orders/${orderId}/cancel`, { reason });
      return data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  async refundOrder(orderId: string, amount?: number, reason?: string): Promise<Order> {
    try {
      const { data } = await api.post(`/orders/${orderId}/refund`, { amount, reason });
      return data;
    } catch (error) {
      console.error('Error refunding order:', error);
      throw error;
    }
  }

  async generateInvoice(orderId: string): Promise<{ invoiceUrl: string }> {
    try {
      const { data } = await api.get(`/orders/${orderId}/invoice`);
      return data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  async getOrderTracking(orderId: string): Promise<{
    status: Order['status'];
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    trackingHistory: Array<{
      status: string;
      location: string;
      timestamp: string;
      description: string;
    }>;
  }> {
    try {
      const { data } = await api.get(`/orders/${orderId}/tracking`);
      return data;
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      throw error;
    }
  }

  // Admin-only methods
  async getAllOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<Order['status'], number>;
    revenueByDay: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
  }> {
    try {
      const { data } = await api.get('/admin/orders/stats', { params });
      return data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;
