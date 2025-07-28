const express = require("express")
const router = express.Router()

// Simple in-memory cart storage (use database in production)
const carts = {}

// @desc    Get user cart
// @route   GET /api/cart
// @access  Public (should be private in production)
router.get("/", async (req, res) => {
  try {
    const userId = req.headers["user-id"] || "guest"
    const cart = carts[userId] || { items: [], total: 0 }

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public (should be private in production)
router.post("/add", async (req, res) => {
  try {
    const userId = req.headers["user-id"] || "guest"
    const { productId, quantity = 1, price, name } = req.body

    if (!productId || !price || !name) {
      return res.status(400).json({
        success: false,
        message: "Product ID, price, and name are required",
      })
    }

    if (!carts[userId]) {
      carts[userId] = { items: [], total: 0 }
    }

    const cart = carts[userId]
    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId)

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({
        productId,
        name,
        price,
        quantity,
      })
    }

    // Calculate total
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Public (should be private in production)
router.put("/update", async (req, res) => {
  try {
    const userId = req.headers["user-id"] || "guest"
    const { productId, quantity } = req.body

    if (!carts[userId]) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    const cart = carts[userId]
    const itemIndex = cart.items.findIndex((item) => item.productId === productId)

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      })
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Public (should be private in production)
router.delete("/remove/:productId", async (req, res) => {
  try {
    const userId = req.headers["user-id"] || "guest"
    const { productId } = req.params

    if (!carts[userId]) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    const cart = carts[userId]
    cart.items = cart.items.filter((item) => item.productId !== productId)

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public (should be private in production)
router.delete("/clear", async (req, res) => {
  try {
    const userId = req.headers["user-id"] || "guest"

    carts[userId] = { items: [], total: 0 }

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: carts[userId],
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

module.exports = router
