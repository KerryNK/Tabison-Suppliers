const express = require("express")
const router = express.Router()

// Sample suppliers data
const sampleSuppliers = [
  {
    _id: "1",
    name: "TechHub Suppliers",
    category: "Electronics",
    location: "Nairobi, Kenya",
    contact: {
      email: "info@techhub.co.ke",
      phone: "+254-700-123456",
    },
    rating: 4.8,
    verified: true,
    description: "Leading supplier of electronics and tech accessories in East Africa",
  },
  {
    _id: "2",
    name: "Office Solutions Ltd",
    category: "Furniture",
    location: "Mombasa, Kenya",
    contact: {
      email: "sales@officesolutions.co.ke",
      phone: "+254-700-789012",
    },
    rating: 4.6,
    verified: true,
    description: "Premium office furniture and workspace solutions",
  },
  {
    _id: "3",
    name: "Lifestyle Accessories",
    category: "Accessories",
    location: "Kisumu, Kenya",
    contact: {
      email: "hello@lifestyle.co.ke",
      phone: "+254-700-345678",
    },
    rating: 4.4,
    verified: false,
    description: "Trendy lifestyle accessories and personal items",
  },
]

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, location, verified } = req.query

    let filteredSuppliers = [...sampleSuppliers]

    // Filter by category
    if (category) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.category.toLowerCase() === category.toLowerCase(),
      )
    }

    // Filter by location
    if (location) {
      filteredSuppliers = filteredSuppliers.filter((supplier) =>
        supplier.location.toLowerCase().includes(location.toLowerCase()),
      )
    }

    // Filter by verified status
    if (verified !== undefined) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.verified === (verified === "true"))
    }

    res.status(200).json({
      success: true,
      count: filteredSuppliers.length,
      data: filteredSuppliers,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const supplier = sampleSuppliers.find((s) => s._id === req.params.id)

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      })
    }

    res.status(200).json({
      success: true,
      data: supplier,
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
