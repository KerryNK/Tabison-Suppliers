const express = require("express")
const router = express.Router()

// Sample products data
const sampleProducts = [
  {
    _id: "1",
    name: "Premium Office Chair",
    type: "Furniture",
    retailPrice: 15000,
    description: "Ergonomic office chair with lumbar support",
    images: ["/placeholder.svg?height=200&width=200"],
    inStock: true,
    stockQuantity: 25,
    features: ["Adjustable height", "Lumbar support", "360° swivel"],
    tags: ["New", "Best Seller"],
  },
  {
    _id: "2",
    name: "Wireless Bluetooth Headphones",
    type: "Electronics",
    retailPrice: 8500,
    description: "High-quality wireless headphones with noise cancellation",
    images: ["/placeholder.svg?height=200&width=200"],
    inStock: true,
    stockQuantity: 50,
    features: ["Noise cancellation", "30-hour battery", "Quick charge"],
    tags: ["New"],
  },
  {
    _id: "3",
    name: "Stainless Steel Water Bottle",
    type: "Accessories",
    retailPrice: 2500,
    description: "Insulated water bottle keeps drinks cold for 24 hours",
    images: ["/placeholder.svg?height=200&width=200"],
    inStock: true,
    stockQuantity: 100,
    features: ["24-hour insulation", "BPA-free", "Leak-proof"],
    tags: ["Best Seller"],
  },
]

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query

    let filteredProducts = [...sampleProducts]

    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.type.toLowerCase() === category.toLowerCase())
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total: filteredProducts.length,
      page: Number.parseInt(page),
      pages: Math.ceil(filteredProducts.length / limit),
      data: paginatedProducts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = sampleProducts.find((p) => p._id === req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.status(200).json({
      success: true,
      data: product,
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
