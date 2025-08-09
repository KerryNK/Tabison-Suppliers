const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  // Product variants (size, color, etc.)
  variants: {
    size: String,
    color: String,
    model: String,
  },
})

const orderSchema = new mongoose.Schema(
  {
    // Order identification
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Order items
    orderItems: [orderItemSchema],
    
    // Shipping information
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      county: { type: String, required: true },
      postalCode: String,
      country: { type: String, default: "Kenya" },
      deliveryInstructions: String,
    },
    
    // Billing information
    billingAddress: {
      fullName: String,
      address: String,
      city: String,
      county: String,
      postalCode: String,
      country: { type: String, default: "Kenya" },
      phone: String,
    },
    
    // Payment information
    paymentMethod: {
      type: String,
      required: true,
      enum: ["mpesa", "stripe", "paypal", "bank_transfer", "cash_on_delivery"],
    },
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
      update_time: String,
      // M-Pesa specific fields
      mpesa_receipt_number: String,
      phone_number: String,
      // Stripe specific fields
      stripe_payment_intent_id: String,
      // PayPal specific fields
      paypal_order_id: String,
    },
    
    // Pricing breakdown
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountAmount: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    
    // Payment status
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: Date,
    
    // Delivery information
    deliveryMethod: {
      type: String,
      enum: ["standard", "express", "pickup", "courier"],
      default: "standard",
    },
    estimatedDelivery: Date,
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: Date,
    
    // Order status tracking
    status: {
      type: String,
      enum: [
        "pending", 
        "confirmed", 
        "processing", 
        "packed", 
        "shipped", 
        "out_for_delivery", 
        "delivered", 
        "cancelled", 
        "refunded", 
        "returned"
      ],
      default: "pending",
    },
    
    // Status history for tracking
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }],
    
    // Tracking information
    tracking: {
      trackingNumber: String,
      carrier: String,
      trackingUrl: String,
      currentLocation: String,
      estimatedDelivery: Date,
    },
    
    // Additional order information
    notes: String,
    specialInstructions: String,
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    
    // Invoice and receipt
    invoiceNumber: String,
    receiptSent: { type: Boolean, default: false },
    receiptSentAt: Date,
    
    // Customer feedback
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    reviewedAt: Date,
    
    // Admin fields
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "tracking.trackingNumber": 1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.orderNumber = `TS${timestamp}${random}`
  }
  
  // Add status to history when status changes
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status updated to ${this.status}`,
    })
  }
  
  next()
})

// Method to update order status
orderSchema.methods.updateStatus = function (status, note, updatedBy) {
  this.status = status
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy,
  })
  
  // Set specific timestamps for certain statuses
  if (status === "delivered") {
    this.isDelivered = true
    this.deliveredAt = new Date()
  }
  
  return this.save()
}

// Method to add tracking information
orderSchema.methods.addTracking = function (trackingData) {
  this.tracking = { ...this.tracking, ...trackingData }
  return this.save()
}

// Virtual for days since order
orderSchema.virtual("daysSinceOrder").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
})

// Ensure virtual fields are serialized
orderSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("Order", orderSchema)
