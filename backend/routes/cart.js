const express = require("express")
const router = express.Router()
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
const { protect } = require("../middleware/authMiddleware")

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product")

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.retailPrice || product.price,
      })
    }

    // Calculate total
    await cart.populate("items.product")
    cart.total = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
router.put("/update/:itemId", protect, async (req, res) => {
  try {
    const { quantity } = req.body
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    // Recalculate total
    await cart.populate("items.product")
    cart.total = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
router.delete("/remove/:itemId", protect, async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

    // Recalculate total
    await cart.populate("items.product")
    cart.total = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete("/clear", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = []
    cart.total = 0
    await cart.save()

    res.json({ message: "Cart cleared successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
