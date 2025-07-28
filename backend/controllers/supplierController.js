const Supplier = require("../models/Supplier")
const Product = require("../models/Product")
const Order = require("../models/Order")

// @desc    Register a new supplier
// @route   POST /api/suppliers/register
// @access  Public
const registerSupplier = async (req, res) => {
  try {
    const { email } = req.body

    const supplierExists = await Supplier.findOne({ email })
    if (supplierExists) {
      return res.status(400).json({
        success: false,
        message: "A supplier with this email already exists",
      })
    }

    const supplier = await Supplier.create(req.body)

    res.status(201).json({
      success: true,
      data: {
        _id: supplier._id,
        name: supplier.name,
        email: supplier.email,
        message: "Registration successful. Your application is under review.",
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Search for suppliers
// @route   GET /api/suppliers/search
// @access  Public
const searchSuppliers = async (req, res) => {
  try {
    const { q, category, location } = req.query
    const query = { status: "approved" }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { specialties: { $regex: q, $options: "i" } },
      ]
    }
    if (category) query.category = category
    if (location) query.city = { $regex: location, $options: "i" }

    const suppliers = await Supplier.find(query)

    res.json({
      success: true,
      suppliers,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get platform statistics
// @route   GET /api/suppliers/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const supplierCount = await Supplier.countDocuments({ status: "approved" })
    const productCount = await Product.countDocuments({})
    const orderCount = await Order.countDocuments({})

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ])

    res.json({
      success: true,
      data: {
        suppliers: supplierCount,
        products: productCount,
        orders: orderCount,
        orderData: ordersByStatus,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  registerSupplier,
  searchSuppliers,
  getStats,
}
