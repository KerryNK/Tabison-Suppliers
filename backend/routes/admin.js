const express = require("express")
const { body, validationResult } = require("express-validator")
const router = express.Router()
const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")
const { verifyFirebaseToken, requireAdmin } = require("../middleware/firebaseAuth")

// All admin routes require authentication and admin role
router.use(verifyFirebaseToken, requireAdmin)

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get("/stats", async (req, res) => {
  try {
    // Get total counts
    const [
      totalProducts,
      totalOrders, 
      totalUsers,
      pendingOrders,
      lowStockProducts,
      revenueData
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
      ])
    ])

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingOrders,
        lowStockProducts
      }
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private (Admin only)
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 50, category, search, sortBy = "createdAt", order = "desc" } = req.query
    
    // Build query
    const query = {}
    if (category && category !== "all") {
      query.category = category
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    // Build sort
    const sort = {}
    sort[sortBy] = order === "desc" ? -1 : 1

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("supplier", "name email")

    const total = await Product.countDocuments(query)

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error("Admin products fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin only)
router.post("/products", [
  body("name").trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("category").trim().notEmpty().withMessage("Category is required"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      })
    }

    const productData = {
      ...req.body,
      createdBy: req.user._id
    }

    const product = new Product(productData)
    await product.save()

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    })
  } catch (error) {
    console.error("Product creation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin only)
router.put("/products/:id", [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters"),
  body("description").optional().trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    })
  } catch (error) {
    console.error("Product update error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin only)
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    console.error("Product deletion error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin only)
router.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 50, status, isPaid, sortBy = "createdAt", order = "desc" } = req.query
    
    // Build query
    const query = {}
    if (status && status !== "all") {
      query.status = status
    }
    if (isPaid !== undefined) {
      query.isPaid = isPaid === "true"
    }

    // Build sort
    const sort = {}
    sort[sortBy] = order === "desc" ? -1 : 1

    const orders = await Order.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("user", "name email phoneNumber")
      .populate("orderItems.product", "name image")

    const total = await Order.countDocuments(query)

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error("Admin orders fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin only)
router.put("/orders/:id/status", [
  body("status").isIn(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid status value"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      })
    }

    const { status, trackingNumber, notes } = req.body

    const updateData = {
      status,
      updatedAt: new Date()
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    if (notes) {
      updateData.adminNotes = notes
    }

    // Update delivery status based on order status
    if (status === "shipped" && trackingNumber) {
      updateData.shippedAt = new Date()
    } else if (status === "delivered") {
      updateData.deliveredAt = new Date()
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "name email")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    // TODO: Send email notification to customer about status change
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    })
  } catch (error) {
    console.error("Order status update error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 50, role, isActive, search, sortBy = "createdAt", order = "desc" } = req.query
    
    // Build query
    const query = {}
    if (role && role !== "all") {
      query.role = role
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true"
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }

    // Build sort
    const sort = {}
    sort[sortBy] = order === "desc" ? -1 : 1

    const users = await User.find(query)
      .select("-password") // Exclude password field
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error("Admin users fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put("/users/:id/status", [
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      })
    }

    const { isActive, reason } = req.body

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot modify your own account status"
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isActive,
        updatedAt: new Date(),
        ...(reason && { statusReason: reason })
      },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    })
  } catch (error) {
    console.error("User status update error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
router.put("/users/:id/role", [
  body("role").isIn(["user", "supplier", "admin"]).withMessage("Invalid role value"),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      })
    }

    const { role } = req.body

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot modify your own role"
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    })
  } catch (error) {
    console.error("User role update error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Get order details for admin
// @route   GET /api/admin/orders/:id
// @access  Private (Admin only)
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phoneNumber")
      .populate("orderItems.product", "name image price")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error("Order details fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Get product categories
// @route   GET /api/admin/categories
// @access  Private (Admin only)
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category")
    
    res.status(200).json({
      success: true,
      data: categories.filter(cat => cat) // Remove empty/null categories
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get("/analytics", async (req, res) => {
  try {
    const { period = "30d" } = req.query
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Sales analytics
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ])

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ])

    res.status(200).json({
      success: true,
      data: {
        salesData,
        topProducts,
        period
      }
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
})

module.exports = router