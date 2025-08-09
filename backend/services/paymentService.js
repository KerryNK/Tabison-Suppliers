const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const axios = require('axios')
const crypto = require('crypto')

class PaymentService {
  constructor() {
    // Initialize PayPal client
    this.initializePayPal()
  }

  // Initialize PayPal
  initializePayPal() {
    try {
      // For production, use live environment
      this.paypalEnvironment = process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
      this.paypalClientId = process.env.PAYPAL_CLIENT_ID
      this.paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET
      
      if (!this.paypalClientId || !this.paypalClientSecret) {
        console.warn('PayPal credentials not configured')
      }
    } catch (error) {
      console.error('PayPal initialization failed:', error.message)
    }
  }

  // Get PayPal access token
  async getPayPalAccessToken() {
    try {
      const auth = Buffer.from(`${this.paypalClientId}:${this.paypalClientSecret}`).toString('base64')
      
      const response = await axios.post(
        `https://api-m.${this.paypalEnvironment}.paypal.com/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      return response.data.access_token
    } catch (error) {
      throw new Error(`PayPal token error: ${error.message}`)
    }
  }

  // ============ STRIPE INTEGRATION ============
  async createStripePaymentIntent(amount, currency = 'kes', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      }
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async confirmStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      
      return {
        success: true,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error('Stripe Payment Confirmation Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async createStripeRefund(paymentIntentId, amount = null) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      })

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
      }
    } catch (error) {
      console.error('Stripe Refund Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // ============ M-PESA INTEGRATION ============
  async generateMpesaAccessToken() {
    try {
      const consumerKey = process.env.MPESA_CONSUMER_KEY
      const consumerSecret = process.env.MPESA_CONSUMER_SECRET
      
      if (!consumerKey || !consumerSecret) {
        throw new Error('M-Pesa credentials not configured')
      }

      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
      
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
          },
        }
      )

      return response.data.access_token
    } catch (error) {
      throw new Error(`M-Pesa token error: ${error.message}`)
    }
  }

  async initiateMpesaSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const accessToken = await this.generateMpesaAccessToken()
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
      const businessShortCode = process.env.MPESA_SHORTCODE || '174379'
      const passkey = process.env.MPESA_PASSKEY
      
      // Generate password
      const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64')
      
      const stkPushData = {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      }

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        stkPushData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage,
      }
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async queryMpesaTransaction(checkoutRequestID) {
    try {
      const accessToken = await this.generateMpesaAccessToken()
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
      const businessShortCode = process.env.MPESA_SHORTCODE || '174379'
      const passkey = process.env.MPESA_PASSKEY
      
      const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64')
      
      const queryData = {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      }

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        queryData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
      }
    } catch (error) {
      console.error('M-Pesa Query Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // ============ PAYPAL INTEGRATION ============
  async createPayPalOrder(amount, currency = 'USD', description = 'Tabison Suppliers Purchase') {
    try {
      const accessToken = await this.getPayPalAccessToken()
      
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2),
          },
          description,
        }],
        application_context: {
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
        },
      }

      const response = await axios.post(
        `https://api-m.${this.paypalEnvironment}.paypal.com/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const order = response.data
      const approvalUrl = order.links.find(link => link.rel === 'approve')?.href

      return {
        success: true,
        orderId: order.id,
        approvalUrl,
        status: order.status,
      }
    } catch (error) {
      console.error('PayPal Order Creation Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async capturePayPalOrder(orderId) {
    try {
      const accessToken = await this.getPayPalAccessToken()
      
      const response = await axios.post(
        `https://api-m.${this.paypalEnvironment}.paypal.com/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const capture = response.data.purchase_units[0].payments.captures[0]
      
      return {
        success: true,
        captureId: capture.id,
        status: capture.status,
        amount: capture.amount,
        paypalOrderId: orderId,
      }
    } catch (error) {
      console.error('PayPal Order Capture Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async refundPayPalPayment(captureId, amount = null, currency = 'USD') {
    try {
      const accessToken = await this.getPayPalAccessToken()
      
      const refundData = amount ? {
        amount: {
          value: amount.toFixed(2),
          currency_code: currency.toUpperCase(),
        },
      } : {}

      const response = await axios.post(
        `https://api-m.${this.paypalEnvironment}.paypal.com/v2/payments/captures/${captureId}/refund`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        refundId: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
      }
    } catch (error) {
      console.error('PayPal Refund Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // ============ UTILITY METHODS ============
  formatPhoneNumber(phoneNumber) {
    // Format phone number for M-Pesa (254XXXXXXXXX format)
    let formatted = phoneNumber.replace(/\D/g, '')
    
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.slice(1)
    } else if (formatted.startsWith('7') || formatted.startsWith('1')) {
      formatted = '254' + formatted
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted
    }
    
    return formatted
  }

  validateAmount(amount) {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Invalid amount')
    }
    return numAmount
  }

  generateTransactionReference() {
    return `TS${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  }

  // Process webhook signatures for security
  verifyStripeWebhook(body, signature) {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
      if (!endpointSecret) {
        throw new Error('Stripe webhook secret not configured')
      }

      return stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`)
    }
  }

  verifyMpesaCallback(body) {
    // Implement M-Pesa callback verification if needed
    // This depends on your security requirements
    return true
  }
}

module.exports = new PaymentService()