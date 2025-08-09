import axios from 'axios'
import { loadStripe, Stripe } from '@stripe/stripe-js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export interface PaymentMethod {
  id: string
  name: string
  description: string
  currencies: string[]
  available: boolean
}

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  amount: number
  currency: string
}

export interface MpesaPayment {
  checkoutRequestID: string
  customerMessage: string
  transactionRef: string
}

export interface PayPalOrder {
  orderId: string
  approvalUrl: string
  status: string
}

export interface PaymentStatus {
  orderId: string
  orderNumber: string
  isPaid: boolean
  paidAt?: string
  paymentMethod: string
  paymentResult: any
  status: string
  totalPrice: number
}

class PaymentService {
  private stripe: Stripe | null = null
  private stripePromise: Promise<Stripe | null> | null = null

  constructor() {
    this.initializeStripe()
  }

  // Initialize Stripe
  private async initializeStripe() {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (publishableKey) {
      this.stripePromise = loadStripe(publishableKey)
      this.stripe = await this.stripePromise
    }
  }

  // Get Stripe instance
  async getStripe(): Promise<Stripe | null> {
    if (!this.stripe && this.stripePromise) {
      this.stripe = await this.stripePromise
    }
    return this.stripe
  }

  // ============ PAYMENT METHODS ============

  // Get available payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/methods`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
      return []
    }
  }

  // ============ STRIPE INTEGRATION ============

  // Create Stripe payment intent
  async createStripePaymentIntent(
    amount: number,
    currency: string = 'kes',
    orderId?: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/stripe/create-intent`, {
        amount,
        currency,
        orderId,
        metadata
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent')
    }
  }

  // Confirm Stripe payment
  async confirmStripePayment(paymentIntentId: string): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/stripe/confirm`, {
        paymentIntentId
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment confirmation failed')
    }
  }

  // Process Stripe payment with card
  async processStripePayment(
    clientSecret: string,
    cardElement: any,
    billingDetails?: any
  ): Promise<any> {
    try {
      const stripe = await this.getStripe()
      if (!stripe) {
        throw new Error('Stripe not initialized')
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails
        }
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.paymentIntent
    } catch (error: any) {
      throw new Error(error.message || 'Payment processing failed')
    }
  }

  // ============ M-PESA INTEGRATION ============

  // Initiate M-Pesa STK Push
  async initiateMpesaPayment(
    phoneNumber: string,
    amount: number,
    orderId?: string
  ): Promise<MpesaPayment> {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/mpesa/stk-push`, {
        phoneNumber,
        amount,
        orderId
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'M-Pesa payment failed')
    }
  }

  // Query M-Pesa transaction status
  async queryMpesaTransaction(checkoutRequestID: string): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/mpesa/query`, {
        checkoutRequestID
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to query transaction')
    }
  }

  // Poll M-Pesa transaction status
  async pollMpesaStatus(
    checkoutRequestID: string,
    maxAttempts: number = 20,
    interval: number = 3000
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let attempts = 0

      const pollInterval = setInterval(async () => {
        attempts++

        try {
          const result = await this.queryMpesaTransaction(checkoutRequestID)
          
          // Check if payment is complete (successful or failed)
          if (result.resultCode === '0') {
            clearInterval(pollInterval)
            resolve({ success: true, result })
          } else if (result.resultCode && result.resultCode !== '1037') {
            // 1037 means request is still being processed
            clearInterval(pollInterval)
            resolve({ success: false, result })
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollInterval)
            reject(new Error('Payment verification timeout'))
          }
        } catch (error) {
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval)
            reject(error)
          }
        }
      }, interval)
    })
  }

  // ============ PAYPAL INTEGRATION ============

  // Create PayPal order
  async createPayPalOrder(
    amount: number,
    currency: string = 'USD',
    orderId?: string,
    description?: string
  ): Promise<PayPalOrder> {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/paypal/create-order`, {
        amount,
        currency,
        orderId,
        description
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'PayPal order creation failed')
    }
  }

  // Capture PayPal order
  async capturePayPalOrder(paypalOrderId: string): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/paypal/capture-order`, {
        orderId: paypalOrderId
      })

      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'PayPal capture failed')
    }
  }

  // ============ GENERAL PAYMENT UTILITIES ============

  // Get payment status
  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/status/${orderId}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status')
    }
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string = 'KES'): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Validate phone number for M-Pesa
  validateKenyanPhone(phoneNumber: string): boolean {
    const kenyanPhoneRegex = /^(\+254|254|0)?([71][0-9]{8})$/
    return kenyanPhoneRegex.test(phoneNumber)
  }

  // Format phone number for M-Pesa
  formatKenyanPhone(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/\D/g, '')
    
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1)
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned
    }
    
    return cleaned
  }

  // Get payment method icon
  getPaymentMethodIcon(methodId: string): string {
    const icons: Record<string, string> = {
      stripe: '💳',
      mpesa: '📱',
      paypal: '🅿️',
      card: '💳',
      mobile: '📱'
    }
    
    return icons[methodId] || '💰'
  }

  // Check if payment method is available for currency
  isPaymentMethodAvailable(method: PaymentMethod, currency: string): boolean {
    return method.available && method.currencies.includes(currency.toUpperCase())
  }

  // Get supported currencies for a payment method
  getSupportedCurrencies(methodId: string): string[] {
    const supportedCurrencies: Record<string, string[]> = {
      mpesa: ['KES'],
      stripe: ['KES', 'USD', 'EUR'],
      paypal: ['USD', 'EUR', 'GBP']
    }
    
    return supportedCurrencies[methodId] || []
  }

  // Calculate fees (if any)
  calculatePaymentFees(amount: number, methodId: string): number {
    // This is a simplified fee calculation
    // In production, you'd want to get this from your backend
    const feeRates: Record<string, number> = {
      mpesa: 0, // M-Pesa fees are usually handled by Safaricom
      stripe: 0.035, // 3.5% + fixed fee
      paypal: 0.044 // 4.4% + fixed fee
    }
    
    return Math.round((amount * (feeRates[methodId] || 0)) * 100) / 100
  }

  // Generate payment reference
  generatePaymentReference(): string {
    return `PAY${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  }
}

export const paymentService = new PaymentService()
export default paymentService