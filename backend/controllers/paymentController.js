import asyncHandler from "express-async-handler"
import Order from "../models/Order.js"
import axios from "axios"

// M-PESA Configuration
const MPESA_CONFIG = {
  BUSINESS_SHORT_CODE: process.env.MPESA_BUSINESS_SHORT_CODE,
  PASSKEY: process.env.MPESA_PASSKEY,
  CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
  CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
  ENVIRONMENT: process.env.MPESA_ENVIRONMENT || "sandbox", // sandbox or live
}

// Get M-PESA access token
const getMpesaAccessToken = async () => {
  const auth = Buffer.from(`${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.CONSUMER_SECRET}`).toString("base64")
  
  const url = MPESA_CONFIG.ENVIRONMENT === "live" 
    ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    return response.data.access_token
  } catch (error) {
    console.error("Error getting M-PESA access token:", error)
    throw new Error("Failed to get M-PESA access token")
  }
}

// @desc    Initiate M-PESA STK Push
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
const initiateMpesaSTKPush = asyncHandler(async (req, res) => {
  const { phoneNumber, amount, orderId } = req.body

  if (!phoneNumber || !amount || !orderId) {
    res.status(400)
    throw new Error("Phone number, amount, and order ID are required")
  }

  // Validate order exists
  const order = await Order.findById(orderId)
  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to pay for this order")
  }

  try {
    const accessToken = await getMpesaAccessToken()
    
    // Format phone number (remove +254 and add 254)
    const formattedPhone = phoneNumber.replace(/^\+254/, "254").replace(/^0/, "254")
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3)
    const password = Buffer.from(
      `${MPESA_CONFIG.BUSINESS_SHORT_CODE}${MPESA_CONFIG.PASSKEY}${timestamp}`
    ).toString("base64")

    const stkPushUrl = MPESA_CONFIG.ENVIRONMENT === "live"
      ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    const stkPushPayload = {
      BusinessShortCode: MPESA_CONFIG.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.BASE_URL}/api/payments/mpesa/callback`,
      AccountReference: order.orderNumber,
      TransactionDesc: `Payment for order ${order.orderNumber}`,
    }

    const response = await axios.post(stkPushUrl, stkPushPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    // Update order with payment initiation
    order.paymentResult = {
      id: response.data.CheckoutRequestID,
      status: "pending",
      phoneNumber: formattedPhone,
      amount: amount,
    }
    await order.save()

    res.json({
      success: true,
      checkoutRequestID: response.data.CheckoutRequestID,
      message: "STK Push sent successfully",
    })
  } catch (error) {
    console.error("M-PESA STK Push error:", error.response?.data || error.message)
    res.status(500)
    throw new Error("Failed to initiate M-PESA payment")
  }
})

// @desc    M-PESA Callback
// @route   POST /api/payments/mpesa/callback
// @access  Public
const mpesaCallback = asyncHandler(async (req, res) => {
  const { Body } = req.body

  if (!Body || !Body.stkCallback) {
    res.status(400)
    throw new Error("Invalid callback data")
  }

  const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback

  try {
    // Find order by CheckoutRequestID
    const order = await Order.findOne({
      "paymentResult.id": CheckoutRequestID,
    })

    if (!order) {
      console.error("Order not found for CheckoutRequestID:", CheckoutRequestID)
      return res.status(404).json({ message: "Order not found" })
    }

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || []
      const mpesaReceiptNumber = metadata.find(item => item.Name === "MpesaReceiptNumber")?.Value
      const transactionDate = metadata.find(item => item.Name === "TransactionDate")?.Value

      order.paymentResult = {
        ...order.paymentResult,
        status: "success",
        transactionId: mpesaReceiptNumber,
        update_time: new Date().toISOString(),
      }
      order.isPaid = true
      order.paidAt = new Date()
      order.status = "paid"

      await order.save()

      console.log(`Payment successful for order ${order.orderNumber}`)
    } else {
      // Payment failed
      order.paymentResult = {
        ...order.paymentResult,
        status: "failed",
        update_time: new Date().toISOString(),
      }
      order.status = "cancelled"

      await order.save()

      console.log(`Payment failed for order ${order.orderNumber}: ${ResultDesc}`)
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Error processing M-PESA callback:", error)
    res.status(500).json({ message: "Error processing callback" })
  }
})

// @desc    Get payment status
// @route   GET /api/payments/status/:orderId
// @access  Private
const getPaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to view this order")
  }

  res.json({
    orderId: order._id,
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentResult?.status || "pending",
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    totalAmount: order.totalPrice,
  })
})

// @desc    Process PayPal payment
// @route   POST /api/payments/paypal
// @access  Private
const processPayPalPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, payerId } = req.body

  if (!orderId || !paymentId || !payerId) {
    res.status(400)
    throw new Error("Order ID, payment ID, and payer ID are required")
  }

  const order = await Order.findById(orderId)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to pay for this order")
  }

  // Update order with PayPal payment details
  order.paymentResult = {
    id: paymentId,
    status: "success",
    update_time: new Date().toISOString(),
    email_address: req.user.email,
  }
  order.isPaid = true
  order.paidAt = new Date()
  order.status = "paid"

  await order.save()

  res.json({
    success: true,
    message: "PayPal payment processed successfully",
    orderNumber: order.orderNumber,
  })
})

export {
  initiateMpesaSTKPush,
  mpesaCallback,
  getPaymentStatus,
  processPayPalPayment,
}