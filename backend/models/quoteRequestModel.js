const mongoose = require("mongoose")

const quoteItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  specifications: {
    size: String,
    color: String,
    model: String,
    customization: String,
  },
  estimatedPrice: Number,
  notes: String,
})

const quoteRequestSchema = new mongoose.Schema(
  {
    // Quote identification
    quoteNumber: {
      type: String,
      unique: true,
      required: true,
    },
    
    // Customer information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    // Contact details (for non-registered users)
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      company: String,
      position: String,
      businessType: String,
    },
    
    // Quote items
    items: [quoteItemSchema],
    
    // Quote details
    title: { type: String, required: true },
    description: String,
    totalQuantity: { type: Number, default: 0 },
    
    // Delivery requirements
    deliveryLocation: {
      city: String,
      county: String,
      country: { type: String, default: "Kenya" },
      address: String,
    },
    requiredDeliveryDate: Date,
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery", "shipping"],
    },
    
    // Business requirements
    budgetRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: "KES" },
    },
    paymentTerms: {
      type: String,
      enum: ["cash", "30_days", "60_days", "90_days", "custom"],
    },
    customPaymentTerms: String,
    
    // Quote status and response
    status: {
      type: String,
      enum: [
        "pending", 
        "reviewing", 
        "quoted", 
        "negotiating", 
        "accepted", 
        "rejected", 
        "expired", 
        "converted"
      ],
      default: "pending",
    },
    
    // Admin response
    adminResponse: {
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
      quotedPrice: Number,
      validUntil: Date,
      terms: String,
      notes: String,
      attachments: [String],
    },
    
    // Status history
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }],
    
    // Communication log
    communications: [{
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      timestamp: { type: Date, default: Date.now },
      type: {
        type: String,
        enum: ["message", "email", "call", "meeting"],
        default: "message",
      },
    }],
    
    // Priority and urgency
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    urgent: { type: Boolean, default: false },
    
    // Additional information
    source: {
      type: String,
      enum: ["website", "phone", "email", "referral", "other"],
      default: "website",
    },
    referralSource: String,
    
    // Files and attachments
    attachments: [String],
    
    // Follow-up information
    followUpDate: Date,
    followUpNote: String,
    
    // Conversion tracking
    convertedToOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    conversionDate: Date,
    
    // Internal notes
    internalNotes: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
quoteRequestSchema.index({ user: 1 });
quoteRequestSchema.index({ quoteNumber: 1 });
quoteRequestSchema.index({ status: 1 });
quoteRequestSchema.index({ "contactInfo.email": 1 });
quoteRequestSchema.index({ createdAt: -1 });
quoteRequestSchema.index({ priority: 1 });

// Pre-save middleware to generate quote number
quoteRequestSchema.pre("save", async function (next) {
  if (this.isNew && !this.quoteNumber) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.quoteNumber = `QT${timestamp}${random}`
  }
  
  // Calculate total quantity
  if (this.items && this.items.length > 0) {
    this.totalQuantity = this.items.reduce((total, item) => total + item.quantity, 0)
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

// Method to update status
quoteRequestSchema.methods.updateStatus = function (status, note, updatedBy) {
  this.status = status
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy,
  })
  return this.save()
}

// Method to add communication
quoteRequestSchema.methods.addCommunication = function (from, message, type = "message") {
  this.communications.push({
    from,
    message,
    type,
    timestamp: new Date(),
  })
  return this.save()
}

// Method to add admin response
quoteRequestSchema.methods.addAdminResponse = function (respondedBy, responseData) {
  this.adminResponse = {
    respondedBy,
    respondedAt: new Date(),
    ...responseData,
  }
  this.status = "quoted"
  return this.save()
}

// Virtual for days since quote request
quoteRequestSchema.virtual("daysSinceRequest").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))
})

// Virtual for total estimated value
quoteRequestSchema.virtual("estimatedValue").get(function () {
  if (!this.items || this.items.length === 0) return 0
  return this.items.reduce((total, item) => {
    return total + (item.estimatedPrice || 0) * item.quantity
  }, 0)
})

// Ensure virtual fields are serialized
quoteRequestSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("QuoteRequest", quoteRequestSchema)


