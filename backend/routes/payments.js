const express = require("express")
const { body, validationResult } = require("express-validator")
const router = express.Router()
const paymentService = require("../services/paymentService")
const Order = require("../models/Order")
const { verifyFirebaseToken, requireActiveAccount } = require("../middleware/firebaseAuth")

// ============ STRIPE ROUTES ============

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
router.post("/stripe/create-intent", [
  verifyFirebaseToken,
  requireActiveAccount,
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("currency").optional().isAlpha().withMessage("Currency must be valid"),
  body("orderId").optional().isMongoId().withMessage("Invalid order ID"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { amount, currency = "kes", orderId, metadata = {} } = req.body

    // Add user info to metadata
    const paymentMetadata = {
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      orderId: orderId || "",
      ...metadata,
    }

    const result = await paymentService.createStripePaymentIntent(
      amount,
      currency,
      paymentMetadata
    )

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to create payment intent",
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: result,
    })
  } catch (error) {
    console.error("Stripe payment intent error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Confirm Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
router.post("/stripe/confirm", [
  verifyFirebaseToken,
  body("paymentIntentId").notEmpty().withMessage("Payment intent ID is required"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { paymentIntentId } = req.body

    const result = await paymentService.confirmStripePayment(paymentIntentId)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Payment confirmation failed",
        error: result.error,
      })
    }

    // Update order if payment was successful
    if (result.status === "succeeded" && result.metadata?.orderId) {
      try {
        const order = await Order.findById(result.metadata.orderId)
        if (order) {
          order.isPaid = true
          order.paidAt = new Date()
          order.paymentResult = {
            stripe_payment_intent_id: paymentIntentId,
            status: result.status,
            update_time: new Date().toISOString(),
          }
          order.status = "confirmed"
          await order.save()
        }
      } catch (orderError) {
        console.error("Order update error:", orderError)
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: result,
    })
  } catch (error) {
    console.error("Stripe payment confirmation error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Stripe webhook endpoint
// @route   POST /api/payments/stripe/webhook
// @access  Public (but verified)
router.post("/stripe/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature']
    
    const event = paymentService.verifyStripeWebhook(req.body, signature)
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Update order status
        if (paymentIntent.metadata?.orderId) {
          try {
            const order = await Order.findById(paymentIntent.metadata.orderId)
            if (order && !order.isPaid) {
              order.isPaid = true
              order.paidAt = new Date()
              order.status = "confirmed"
              await order.save()
            }
          } catch (error) {
            console.error('Webhook order update error:', error)
          }
        }
        break
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break
        
      default:
        console.log('Unhandled event type:', event.type)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error.message)
    res.status(400).json({ 
      success: false, 
      error: 'Webhook signature verification failed' 
    })
  }
})

// ============ M-PESA ROUTES ============

// @desc    Initiate M-Pesa STK Push
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
router.post("/mpesa/stk-push", [
  verifyFirebaseToken,
  requireActiveAccount,
  body("phoneNumber").isMobilePhone().withMessage("Valid phone number is required"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("orderId").optional().isMongoId().withMessage("Invalid order ID"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { phoneNumber, amount, orderId } = req.body
    
    const formattedPhone = paymentService.formatPhoneNumber(phoneNumber)
    const validAmount = paymentService.validateAmount(amount)
    const transactionRef = paymentService.generateTransactionReference()
    
    const result = await paymentService.initiateMpesaSTKPush(
      formattedPhone,
      validAmount,
      orderId || transactionRef,
      `Payment for Tabison Suppliers Order`
    )

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to initiate M-Pesa payment",
        error: result.error,
      })
    }

    // Store the checkout request ID for later verification
    if (orderId) {
      try {
        const order = await Order.findById(orderId)
        if (order) {
          order.paymentResult = {
            mpesa_checkout_request_id: result.checkoutRequestID,
            mpesa_phone_number: formattedPhone,
          }
          await order.save()
        }
      } catch (orderError) {
        console.error("Order update error:", orderError)
      }
    }

    res.status(200).json({
      success: true,
      message: "M-Pesa payment initiated successfully",
      data: {
        checkoutRequestID: result.checkoutRequestID,
        customerMessage: result.customerMessage,
        transactionRef,
      },
    })
  } catch (error) {
    console.error("M-Pesa STK Push error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Query M-Pesa transaction status
// @route   POST /api/payments/mpesa/query
// @access  Private
router.post("/mpesa/query", [
  verifyFirebaseToken,
  body("checkoutRequestID").notEmpty().withMessage("Checkout request ID is required"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { checkoutRequestID } = req.body

    const result = await paymentService.queryMpesaTransaction(checkoutRequestID)

    res.status(200).json({
      success: true,
      message: "Transaction status retrieved",
      data: result,
    })
  } catch (error) {
    console.error("M-Pesa query error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    M-Pesa callback endpoint
// @route   POST /api/payments/mpesa/callback
// @access  Public (from Safaricom)
router.post("/mpesa/callback", async (req, res) => {
  try {
    console.log("M-Pesa Callback received:", JSON.stringify(req.body, null, 2))

    const { Body } = req.body
    const { stkCallback } = Body

    if (stkCallback) {
      const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback

      if (ResultCode === 0) {
        // Payment was successful
        console.log("M-Pesa payment successful:", CheckoutRequestID)
        
        // Extract payment details from CallbackMetadata
        let mpesaReceiptNumber, phoneNumber, amount
        
        if (CallbackMetadata && CallbackMetadata.Item) {
          CallbackMetadata.Item.forEach(item => {
            switch (item.Name) {
              case 'MpesaReceiptNumber':
                mpesaReceiptNumber = item.Value
                break
              case 'PhoneNumber':
                phoneNumber = item.Value
                break
              case 'Amount':
                amount = item.Value
                break
            }
          })
        }

        // Update order in database
        try {
          const order = await Order.findOne({
            'paymentResult.mpesa_checkout_request_id': CheckoutRequestID
          })

          if (order) {
            order.isPaid = true
            order.paidAt = new Date()
            order.paymentResult = {
              ...order.paymentResult,
              mpesa_receipt_number: mpesaReceiptNumber,
              status: 'completed',
              update_time: new Date().toISOString(),
            }
            order.status = "confirmed"
            await order.save()

            console.log("Order updated successfully:", order.orderNumber)
          }
        } catch (orderError) {
          console.error("Order update error in callback:", orderError)
        }
      } else {
        // Payment failed
        console.log("M-Pesa payment failed:", ResultDesc)
        
        try {
          const order = await Order.findOne({
            'paymentResult.mpesa_checkout_request_id': CheckoutRequestID
          })

          if (order) {
            order.paymentResult = {
              ...order.paymentResult,
              status: 'failed',
              error_description: ResultDesc,
              update_time: new Date().toISOString(),
            }
            await order.save()
          }
        } catch (orderError) {
          console.error("Order update error in failed callback:", orderError)
        }
      }
    }

    // Always respond with success to Safaricom
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Success"
    })
  } catch (error) {
    console.error("M-Pesa callback error:", error)
    res.status(200).json({
      ResultCode: 1,
      ResultDesc: "Failed"
    })
  }
})

// ============ PAYPAL ROUTES ============

// @desc    Create PayPal order
// @route   POST /api/payments/paypal/create-order
// @access  Private
router.post("/paypal/create-order", [
  verifyFirebaseToken,
  requireActiveAccount,
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("currency").optional().isAlpha().withMessage("Currency must be valid"),
  body("orderId").optional().isMongoId().withMessage("Invalid order ID"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { amount, currency = "USD", orderId, description } = req.body
    
    const validAmount = paymentService.validateAmount(amount)
    
    const result = await paymentService.createPayPalOrder(
      validAmount,
      currency,
      description || `Tabison Suppliers Order ${orderId || ""}`
    )

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to create PayPal order",
        error: result.error,
      })
    }

    // Store PayPal order ID in our order
    if (orderId) {
      try {
        const order = await Order.findById(orderId)
        if (order) {
          order.paymentResult = {
            paypal_order_id: result.orderId,
          }
          await order.save()
        }
      } catch (orderError) {
        console.error("Order update error:", orderError)
      }
    }

    res.status(200).json({
      success: true,
      message: "PayPal order created successfully",
      data: result,
    })
  } catch (error) {
    console.error("PayPal order creation error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// @desc    Capture PayPal order
// @route   POST /api/payments/paypal/capture-order
// @access  Private
router.post("/paypal/capture-order", [
  verifyFirebaseToken,
  body("orderId").notEmpty().withMessage("PayPal order ID is required"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { orderId: paypalOrderId } = req.body

    const result = await paymentService.capturePayPalOrder(paypalOrderId)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to capture PayPal payment",
        error: result.error,
      })
    }

    // Update order in database
    try {
      const order = await Order.findOne({
        'paymentResult.paypal_order_id': paypalOrderId
      })

      if (order) {
        order.isPaid = true
        order.paidAt = new Date()
        order.paymentResult = {
          ...order.paymentResult,
          paypal_capture_id: result.captureId,
          status: result.status,
          update_time: new Date().toISOString(),
        }
        order.status = "confirmed"
        await order.save()
      }
    } catch (orderError) {
      console.error("Order update error:", orderError)
    }

    res.status(200).json({
      success: true,
      message: "PayPal payment captured successfully",
      data: result,
    })
  } catch (error) {
    console.error("PayPal capture error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// ============ GENERAL PAYMENT ROUTES ============

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get("/methods", verifyFirebaseToken, (req, res) => {
  const paymentMethods = [
    {
      id: "mpesa",
      name: "M-Pesa",
      description: "Pay with M-Pesa mobile money",
      currencies: ["KES"],
      available: !!process.env.MPESA_CONSUMER_KEY,
    },
    {
      id: "stripe",
      name: "Card Payment",
      description: "Pay with credit or debit card",
      currencies: ["KES", "USD", "EUR"],
      available: !!process.env.STRIPE_SECRET_KEY,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with PayPal account",
      currencies: ["USD", "EUR", "GBP"],
      available: !!process.env.PAYPAL_CLIENT_ID,
    },
  ]

  res.status(200).json({
    success: true,
    data: paymentMethods.filter(method => method.available),
  })
})

// @desc    Get payment status
// @route   GET /api/payments/status/:orderId
// @access  Private
router.get("/status/:orderId", verifyFirebaseToken, async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        paymentMethod: order.paymentMethod,
        paymentResult: order.paymentResult,
        status: order.status,
        totalPrice: order.totalPrice,
      },
    })
  } catch (error) {
    console.error("Payment status error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

module.exports = router
