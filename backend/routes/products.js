const express = require("express")
const { getProducts, getProduct, createProduct } = require("../controllers/productController")
const { protect, admin } = require("../middlewares/auth")
const router = express.Router()

// Sample products data
const sampleProducts = [
  {
    _id: "1",
    name: "Military Combat Boots",
    description: "High-quality military combat boots for professional use",
    category: "Military Footwear",
    type: "Combat Boots",
    retailPrice: 12500,
    wholesalePrice: 10000,
    images: ["/placeholder.svg?height=300&width=300&text=Combat+Boots"],
    features: ["Waterproof", "Steel toe", "Anti-slip sole", "Durable leather"],
    inStock: true,
    stockQuantity: 50,
    supplier: "Tabison Suppliers",
    tags: ["Military", "Professional", "Durable"],
    specifications: {
      material: "Genuine Leather",
      sole: "Rubber",
      closure: "Lace-up",
      waterproof: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Safety Work Boots",
    description: "Industrial safety boots with steel toe protection",
    category: "Safety Footwear",
    type: "Work Boots",
    retailPrice: 8500,
    wholesalePrice: 7000,
    images: ["/placeholder.svg?height=300&width=300&text=Safety+Boots"],
    features: ["Steel toe cap", "Oil resistant", "Electrical hazard protection", "Comfortable fit"],
    inStock: true,
    stockQuantity: 75,
    supplier: "Tabison Suppliers",
    tags: ["Safety", "Industrial", "Protection"],
    specifications: {
      material: "Synthetic Leather",
      sole: "PU/Rubber",
      closure: "Lace-up",
      safetyRating: "S3",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Police Duty Boots",
    description: "Professional police duty boots for law enforcement",
    category: "Law Enforcement",
    type: "Duty Boots",
    retailPrice: 11000,
    wholesalePrice: 9000,
    images: ["/placeholder.svg?height=300&width=300&text=Police+Boots"],
    features: ["Quick lacing system", "Moisture wicking", "Slip resistant", "Professional appearance"],
    inStock: true,
    stockQuantity: 30,
    supplier: "Tabison Suppliers",
    tags: ["Police", "Professional", "Duty"],
    specifications: {
      material: "Full Grain Leather",
      sole: "Vibram",
      closure: "Side Zip + Laces",
      height: "8 inches",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Tactical Hiking Boots",
    description: "Lightweight tactical boots for outdoor operations",
    category: "Tactical Gear",
    type: "Hiking Boots",
    retailPrice: 9500,
    wholesalePrice: 7500,
    images: ["/placeholder.svg?height=300&width=300&text=Tactical+Boots"],
    features: ["Lightweight design", "Breathable mesh", "Ankle support", "Multi-terrain grip"],
    inStock: true,
    stockQuantity: 40,
    supplier: "Tabison Suppliers",
    tags: ["Tactical", "Outdoor", "Lightweight"],
    specifications: {
      material: "Nylon/Leather",
      sole: "EVA/Rubber",
      closure: "Lace-up",
      weight: "1.2kg per pair",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Desert Combat Boots",
    description: "Specialized desert combat boots for arid environments",
    category: "Military Footwear",
    type: "Desert Boots",
    retailPrice: 13500,
    wholesalePrice: 11000,
    images: ["/placeholder.svg?height=300&width=300&text=Desert+Boots"],
    features: ["Sand resistant", "Breathable fabric", "Quick dry", "Desert camouflage"],
    inStock: false,
    stockQuantity: 0,
    supplier: "Tabison Suppliers",
    tags: ["Military", "Desert", "Specialized"],
    specifications: {
      material: "Suede/Canvas",
      sole: "Vibram Desert",
      closure: "Lace-up",
      color: "Desert Tan",
    },
    createdAt: new Date().toISOString(),
  },
]

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get("/", getProducts)

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", getProduct)

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = [...new Set(sampleProducts.map((product) => product.category))]

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
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
