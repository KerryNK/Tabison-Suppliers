const express = require("express")
const router = express.Router()

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (should be private in production)
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Orders endpoint is working",
      data: [],
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
// @access  Public (should be private in production)
router.post("/", async (req, res) => {
  try {
    const { items, total } = req.body

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: Date.now().toString(),
        items,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
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
