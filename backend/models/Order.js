
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    specifications: {
      size: String,
      color: String
    }
  }],
  shipping: {
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      county: { type: String, required: true },
      postalCode: String,
      country: { type: String, default: 'Kenya' }
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      required: true
    },
    cost: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['mpesa', 'stripe', 'paypal', 'bank-transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    amount: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  tracking: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    history: [{
      status: String,
      location: String,
      timestamp: { type: Date, default: Date.now },
      note: String
    }]
  },
  notes: String
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TS${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
