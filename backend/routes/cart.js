const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const Product = require("../models/productModel")

// In-memory cart storage (in production, use Redis or database)
const userCarts = new Map()

// Helper function to get user cart
const getUserCart = (userId) => {
  if (!userCarts.has(userId)) {
    userCarts.set(userId, { items: [], total: 0 })
  }
  return userCarts.get(userId)
}

// Helper function to calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.product.retailPrice * item.quantity
  }, 0)
}

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = getUserCart(req.user.id)

    // Populate product details
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId)
          if (!product) {
            return null // Remove invalid items
          }
          return {
            product,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions || {},
          }
        } catch (error) {
          console.error("Error populating product:", error)
          return null
        }
      }),
    )

    // Filter out null items (invalid products)
    const validItems = populatedItems.filter((item) => item !== null)

    // Update cart with valid items
    cart.items = validItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
    }))

    const total = calculateCartTotal(validItems)
    cart.total = total

    userCarts.set(req.user.id, cart)

    res.json({
      items: validItems,
      total,
      itemCount: validItems.reduce((count, item) => count + item.quantity, 0),
      subtotal: total,
      tax: total * 0.16, // 16% VAT
      shipping: total > 5000 ? 0 : 500, // Free shipping over 5000 KSH
    })
  } catch (error) {
    console.error("Cart fetch error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add item to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedOptions = {} } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        message: `Only ${product.stockQuantity} items available in stock`,
      })
    }

    const cart = getUserCart(req.user.id)

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString())

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity
      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({
          message: `Cannot add more items. Only ${product.stockQuantity} available in stock`,
        })
      }
      cart.items[existingItemIndex].quantity = newQuantity
      cart.items[existingItemIndex].selectedOptions = {
        ...cart.items[existingItemIndex].selectedOptions,
        ...selectedOptions,
      }
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        selectedOptions,
      })
    }

    // Recalculate total
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const prod = await Product.findById(item.productId)
        return {
          product: prod,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
        }
      }),
    )

    cart.total = calculateCartTotal(populatedItems)
    userCarts.set(req.user.id, cart)

    res.json({
      items: populatedItems,
      total: cart.total,
      itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
      message: "Item added to cart successfully",
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update item quantity
router.put("/items/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (quantity > product.stockQuantity) {
      return res.status(400).json({
        message: `Only ${product.stockQuantity} items available in stock`,
      })
    }

    const cart = getUserCart(req.user.id)
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString())

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    cart.items[itemIndex].quantity = quantity

    // Recalculate total
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const prod = await Product.findById(item.productId)
        return {
          product: prod,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
        }
      }),
    )

    cart.total = calculateCartTotal(populatedItems)
    userCarts.set(req.user.id, cart)

    res.json({
      items: populatedItems,
      total: cart.total,
      itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
      message: "Cart updated successfully",
    })
  } catch (error) {
    console.error("Update cart error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Remove item from cart
router.delete("/items/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params
    const cart = getUserCart(req.user.id)

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId.toString())

    // Recalculate total
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId)
        return {
          product,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
        }
      }),
    )

    cart.total = calculateCartTotal(populatedItems)
    userCarts.set(req.user.id, cart)

    res.json({
      items: populatedItems,
      total: cart.total,
      itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
      message: "Item removed from cart",
    })
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Clear cart
router.delete("/", auth, async (req, res) => {
  try {
    const cart = { items: [], total: 0 }
    userCarts.set(req.user.id, cart)

    res.json({
      items: [],
      total: 0,
      itemCount: 0,
      message: "Cart cleared successfully",
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
