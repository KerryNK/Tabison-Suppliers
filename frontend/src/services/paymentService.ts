import api from '../api/client';

export interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card' | 'paypal';
  details: CardDetails | MpesaDetails | PayPalDetails;
}

interface CardDetails {
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

interface MpesaDetails {
  phoneNumber: string;
}

interface PayPalDetails {
  email: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  paymentMethod: PaymentMethod;
  clientSecret?: string;
}

class PaymentService {
  // Card payments (Stripe)
  async createCardPaymentIntent(amount: number, currency: string = 'KES'): Promise<PaymentIntent> {
    try {
      const { data } = await api.post('/payments/card/create-intent', { amount, currency });
      return data;
    } catch (error) {
      console.error('Error creating card payment intent:', error);
      throw error;
    }
  }

  async confirmCardPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    try {
      const { data } = await api.post('/payments/card/confirm', {
        paymentIntentId,
        paymentMethodId,
      });
      return data;
    } catch (error) {
      console.error('Error confirming card payment:', error);
      throw error;
    }
  }

  // M-Pesa payments
  async initiateMpesaPayment(phoneNumber: string, amount: number): Promise<{
    checkoutRequestId: string;
    merchantRequestId: string;
  }> {
    try {
      const { data } = await api.post('/payments/mpesa/initiate', {
        phoneNumber,
        amount,
      });
      return data;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw error;
    }
  }

  async checkMpesaPaymentStatus(checkoutRequestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    resultCode?: string;
    resultDesc?: string;
  }> {
    try {
      const { data } = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
      return data;
    } catch (error) {
      console.error('Error checking M-Pesa payment status:', error);
      throw error;
    }
  }

  // PayPal payments
  async createPayPalOrder(amount: number, currency: string = 'USD'): Promise<{
    orderId: string;
    approvalUrl: string;
  }> {
    try {
      const { data } = await api.post('/payments/paypal/create-order', {
        amount,
        currency,
      });
      return data;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  }

  async capturePayPalOrder(orderId: string): Promise<{
    status: 'completed' | 'failed';
    transactionId?: string;
  }> {
    try {
      const { data } = await api.post(`/payments/paypal/capture-order/${orderId}`);
      return data;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  }

  // Saved payment methods
  async getSavedPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const { data } = await api.get('/payments/methods');
      return data;
    } catch (error) {
      console.error('Error fetching saved payment methods:', error);
      throw error;
    }
  }

  async savePaymentMethod(paymentMethodId: string, type: PaymentMethod['type']): Promise<PaymentMethod> {
    try {
      const { data } = await api.post('/payments/methods', {
        paymentMethodId,
        type,
      });
      return data;
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.delete(`/payments/methods/${paymentMethodId}`);
      return data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Refunds
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{
    id: string;
    amount: number;
    status: 'pending' | 'succeeded' | 'failed';
  }> {
    try {
      const { data } = await api.post('/payments/refund', {
        paymentIntentId,
        amount,
        reason,
      });
      return data;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
