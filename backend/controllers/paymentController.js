
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

// M-Pesa STK Push
exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber, amount } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // M-Pesa API configuration
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    // Get access token
    const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    const accessToken = tokenResponse.data.access_token;
    
    // Format phone number
    const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.substring(1)}`;
    
    // STK Push request
    const timestamp = new Date().toISOString().replace(/[.\-:]/g, '').replace('T', '').substring(0, 14);
    const password = Buffer.from(`${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    const stkResponse = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.API_URL}/api/payments/mpesa/callback`,
      AccountReference: order.orderNumber,
      TransactionDesc: `Payment for order ${order.orderNumber}`
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Update order with checkout request ID
    order.payment.transactionId = stkResponse.data.CheckoutRequestID;
    order.payment.status = 'processing';
    await order.save();

    res.json({
      success: true,
      message: 'Payment initiated. Please check your phone for M-Pesa prompt.',
      checkoutRequestId: stkResponse.data.CheckoutRequestID
    });

  } catch (error) {
    console.error('M-Pesa payment error:', error);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// M-Pesa Callback
exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    const order = await Order.findOne({ 
      'payment.transactionId': stkCallback.CheckoutRequestID 
    });

    if (order) {
      if (stkCallback.ResultCode === 0) {
        // Payment successful
        order.payment.status = 'completed';
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        
        // Extract M-Pesa receipt number
        const callbackMetadata = stkCallback.CallbackMetadata.Item;
        const receiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        order.payment.transactionId = receiptNumber;
        
        await order.save();
        
        // Send receipt email (implement separately)
        // await sendReceiptEmail(order);
        
      } else {
        // Payment failed
        order.payment.status = 'failed';
        await order.save();
      }
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
};

// Stripe Payment Intent
exports.createStripePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.payment.amount.total * 100), // Convert to cents
      currency: 'kes',
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    order.payment.transactionId = paymentIntent.id;
    order.payment.status = 'processing';
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({ message: 'Payment creation failed', error: error.message });
  }
};

// Stripe Webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    const order = await Order.findById(paymentIntent.metadata.orderId);
    if (order) {
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();
      
      // Send receipt email
      // await sendReceiptEmail(order);
    }
  }

  res.json({ received: true });
};
