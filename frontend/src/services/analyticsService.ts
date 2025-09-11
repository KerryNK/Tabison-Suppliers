import api from '../api/client';

export interface AnalyticsTimeRange {
  startDate: string;
  endDate: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface ProductMetrics {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  topSellers: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  customerGrowth: number;
  topCustomers: Array<{
    id: string;
    name: string;
    orders: number;
    totalSpent: number;
  }>;
}

export interface OrderMetrics {
  ordersByStatus: Record<string, number>;
  averageProcessingTime: number;
  orderTrends: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

class AnalyticsService {
  async getSalesMetrics(timeRange: AnalyticsTimeRange): Promise<SalesMetrics> {
    try {
      const { data } = await api.get<SalesMetrics>('/analytics/sales', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
      throw error;
    }
  }

  async getProductMetrics(timeRange: AnalyticsTimeRange): Promise<ProductMetrics> {
    try {
      const { data } = await api.get<ProductMetrics>('/analytics/products', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching product metrics:', error);
      throw error;
    }
  }

  async getCustomerMetrics(timeRange: AnalyticsTimeRange): Promise<CustomerMetrics> {
    try {
      const { data } = await api.get<CustomerMetrics>('/analytics/customers', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching customer metrics:', error);
      throw error;
    }
  }

  async getOrderMetrics(timeRange: AnalyticsTimeRange): Promise<OrderMetrics> {
    try {
      const { data } = await api.get<OrderMetrics>('/analytics/orders', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching order metrics:', error);
      throw error;
    }
  }

  async getRevenueByCategory(timeRange: AnalyticsTimeRange): Promise<
    Array<{
      category: string;
      revenue: number;
      orders: number;
    }>
  > {
    try {
      const { data } = await api.get('/analytics/revenue/by-category', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching category revenue:', error);
      throw error;
    }
  }

  async getPaymentMethodStats(timeRange: AnalyticsTimeRange): Promise<
    Array<{
      method: string;
      volume: number;
      count: number;
    }>
  > {
    try {
      const { data } = await api.get('/analytics/payments/methods', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching payment method stats:', error);
      throw error;
    }
  }

  async getInventoryAlerts(): Promise<
    Array<{
      productId: string;
      name: string;
      currentStock: number;
      minimumStock: number;
      status: 'low' | 'critical' | 'out';
    }>
  > {
    try {
      const { data } = await api.get('/analytics/inventory/alerts');
      return data;
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(timeRange: AnalyticsTimeRange): Promise<{
    averageLoadTime: number;
    errorRate: number;
    apiLatency: number;
    userSessions: number;
  }> {
    try {
      const { data } = await api.get('/analytics/performance', {
        params: timeRange,
      });
      return data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
