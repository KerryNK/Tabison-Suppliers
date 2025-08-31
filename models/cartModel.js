const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Calculate total before saving
cartSchema.pre("save", async function (next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  } else {
    this.total = 0
  }
  next()
})

module.exports = mongoose.model("Cart", cartSchema)
