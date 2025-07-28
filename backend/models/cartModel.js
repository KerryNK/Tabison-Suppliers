const mongoose = require("mongoose")

const cartItemSchema = mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  },
)

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate total amount before saving
cartSchema.pre("save", async function (next) {
  if (this.items && this.items.length > 0) {
    await this.populate("items.product")
    this.totalAmount = this.items.reduce((total, item) => {
      return total + item.product.retailPrice * item.quantity
    }, 0)
  } else {
    this.totalAmount = 0
  }
  next()
})

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart
