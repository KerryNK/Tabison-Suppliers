const express = require("express")
const router = express.Router()

// Sample cart data (in production, this would be user-specific and stored in database)
const userCart = {
  _id: "1",
  userId: "1",
  items: [],
  totalAmount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Sample products for cart operations
const sampleProducts = [
  {
    _id: "1",
    name: "Military Combat Boots",
    retailPrice: 12500,
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    _id: "2",
    name: "Safety Work Boots",
    retailPrice: 8500,
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    _id: "3",
    name: "Police Duty Boots",
    retailPrice: 11000,
    images: ["/placeholder.svg?height=200&width=200"],
  },
]

// Helper function to calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: userCart,
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
// @access  Private
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    // Find product
    const product = sampleProducts.find((p) => p._id === productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Check if item already exists in cart
    const existingItemIndex = userCart.items.findIndex((item) => item.productId === productId)

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      userCart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      userCart.items.push({
        productId,
        name: product.name,
        price: product.retailPrice,
        image: product.images[0],
        quantity,
      })
    }

    // Recalculate total
    userCart.totalAmount = calculateCartTotal(userCart.items)
    userCart.updatedAt = new Date().toISOString()

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: userCart,
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
// @route   POST /api/cart/remove
// @access  Private
router.post("/remove", async (req, res) => {
  try {
    const { productId } = req.body

    // Remove item from cart
    userCart.items = userCart.items.filter((item) => item.productId !== productId)

    // Recalculate total
    userCart.totalAmount = calculateCartTotal(userCart.items)
    userCart.updatedAt = new Date().toISOString()

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: userCart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
router.put("/update", async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      })
    }

    // Find and update item
    const itemIndex = userCart.items.findIndex((item) => item.productId === productId)
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      })
    }

    userCart.items[itemIndex].quantity = quantity

    // Recalculate total
    userCart.totalAmount = calculateCartTotal(userCart.items)
    userCart.updatedAt = new Date().toISOString()

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: userCart,
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
// @access  Private
router.delete("/clear", async (req, res) => {
  try {
    userCart.items = []
    userCart.totalAmount = 0
    userCart.updatedAt = new Date().toISOString()

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: userCart,
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
