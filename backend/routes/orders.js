const express = require("express")
const router = express.Router()

// Sample orders data
const sampleOrders = [
  {
    _id: "1",
    userId: "1",
    items: [
      {
        productId: "1",
        name: "Premium Office Chair",
        price: 15000,
        quantity: 1,
      },
    ],
    totalAmount: 15000,
    status: "pending",
    shippingAddress: {
      street: "123 Main St",
      city: "Nairobi",
      country: "Kenya",
    },
    createdAt: new Date().toISOString(),
  },
]

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get("/", async (req, res) => {
  try {
    // In production, filter by user ID from token
    const userOrders = sampleOrders

    res.status(200).json({
      success: true,
      count: userOrders.length,
      data: userOrders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      })
    }

    // Calculate total
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)

    const newOrder = {
      _id: String(sampleOrders.length + 1),
      userId: "1", // In production, get from token
      items,
      totalAmount,
      status: "pending",
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
    }

    sampleOrders.push(newOrder)

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const order = sampleOrders.find((order) => order._id === req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.status(200).json({
      success: true,
      data: order,
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
