import api from '../api/client';

export type NotificationType = 'email' | 'sms' | 'push';
export type NotificationTemplate = 
  | 'welcome'
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'password_reset'
  | 'quote_request'
  | 'payment_success'
  | 'payment_failed';

export interface NotificationData {
  recipient: {
    email?: string;
    phone?: string;
    userId?: string;
  };
  template: NotificationTemplate;
  data: Record<string, any>;
  type: NotificationType[];
}

class NotificationService {
  async sendNotification(notificationData: NotificationData): Promise<{
    success: boolean;
    messageIds: string[];
  }> {
    try {
      const { data } = await api.post<{ success: boolean; messageIds: string[] }>(
        '/notifications/send',
        notificationData
      );
      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(orderId: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>(
        `/notifications/orders/${orderId}/confirmation`
      );
      return data;
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      throw error;
    }
  }

  async sendShippingUpdate(orderId: string, trackingNumber: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>(
        `/notifications/orders/${orderId}/shipping`,
        { trackingNumber }
      );
      return data;
    } catch (error) {
      console.error('Error sending shipping update:', error);
      throw error;
    }
  }

  async sendPasswordResetLink(email: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>(
        '/notifications/password-reset',
        { email }
      );
      return data;
    } catch (error) {
      console.error('Error sending password reset link:', error);
      throw error;
    }
  }

  async subscribeToNotifications(
    userId: string,
    preferences: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    }
  ): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>(
        `/notifications/preferences/${userId}`,
        preferences
      );
      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async registerPushToken(token: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>(
        '/notifications/push/register',
        { token }
      );
      return data;
    } catch (error) {
      console.error('Error registering push token:', error);
      throw error;
    }
  }

  async unregisterPushToken(token: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>(
        '/notifications/push/unregister',
        { token }
      );
      return data;
    } catch (error) {
      console.error('Error unregistering push token:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
