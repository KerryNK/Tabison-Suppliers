const express = require("express")
const router = express.Router()
const { registerSupplier, searchSuppliers, getStats } = require("../controllers/supplierController")

// Sample suppliers data
const sampleSuppliers = [
  {
    _id: "1",
    name: "Tabison Suppliers",
    description: "Leading supplier of military, safety, and professional footwear in Kenya",
    category: "Footwear Manufacturing",
    location: {
      address: "Industrial Area, Nairobi",
      city: "Nairobi",
      country: "Kenya",
      coordinates: {
        lat: -1.3194,
        lng: 36.8518,
      },
    },
    contact: {
      phone: "+254-700-123456",
      email: "info@tabisonsuppliers.com",
      website: "https://tabisonsuppliers.com",
    },
    businessHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    specialties: ["Military Boots", "Safety Footwear", "Police Equipment", "Tactical Gear"],
    certifications: ["ISO 9001:2015", "KEBS Certified", "Military Standards Compliant"],
    established: "2010",
    employees: "50-100",
    verified: true,
    rating: 4.8,
    totalReviews: 156,
    logo: "/placeholder.svg?height=100&width=100&text=Tabison+Logo",
    images: [
      "/placeholder.svg?height=300&width=400&text=Factory+View",
      "/placeholder.svg?height=300&width=400&text=Showroom",
      "/placeholder.svg?height=300&width=400&text=Products",
    ],
    tags: ["Manufacturer", "Wholesale", "B2B", "Government Contracts"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Kenya Safety Equipment Ltd",
    description: "Comprehensive safety equipment and protective gear supplier",
    category: "Safety Equipment",
    location: {
      address: "Mombasa Road, Nairobi",
      city: "Nairobi",
      country: "Kenya",
      coordinates: {
        lat: -1.3056,
        lng: 36.8317,
      },
    },
    contact: {
      phone: "+254-722-987654",
      email: "sales@kenyasafety.co.ke",
      website: "https://kenyasafety.co.ke",
    },
    businessHours: {
      monday: "7:30 AM - 5:30 PM",
      tuesday: "7:30 AM - 5:30 PM",
      wednesday: "7:30 AM - 5:30 PM",
      thursday: "7:30 AM - 5:30 PM",
      friday: "7:30 AM - 5:30 PM",
      saturday: "8:00 AM - 2:00 PM",
      sunday: "Closed",
    },
    specialties: ["Safety Boots", "Hard Hats", "Protective Clothing", "Industrial Equipment"],
    certifications: ["OSHA Compliant", "CE Marked Products", "KEBS Certified"],
    established: "2005",
    employees: "20-50",
    verified: true,
    rating: 4.6,
    totalReviews: 89,
    logo: "/placeholder.svg?height=100&width=100&text=KSE+Logo",
    images: [
      "/placeholder.svg?height=300&width=400&text=Warehouse",
      "/placeholder.svg?height=300&width=400&text=Safety+Gear",
    ],
    tags: ["Safety", "Industrial", "PPE", "Distributor"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "East Africa Tactical Solutions",
    description: "Specialized tactical and military equipment supplier for East Africa",
    category: "Tactical Equipment",
    location: {
      address: "Westlands, Nairobi",
      city: "Nairobi",
      country: "Kenya",
      coordinates: {
        lat: -1.2676,
        lng: 36.8108,
      },
    },
    contact: {
      phone: "+254-733-456789",
      email: "info@eatactical.com",
      website: "https://eatactical.com",
    },
    businessHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    specialties: ["Tactical Boots", "Military Gear", "Law Enforcement Equipment", "Security Solutions"],
    certifications: ["NATO Standards", "Military Approved", "Security Certified"],
    established: "2015",
    employees: "10-20",
    verified: true,
    rating: 4.7,
    totalReviews: 67,
    logo: "/placeholder.svg?height=100&width=100&text=EATS+Logo",
    images: ["/placeholder.svg?height=300&width=400&text=Tactical+Equipment"],
    tags: ["Tactical", "Military", "Law Enforcement", "Security"],
    createdAt: new Date().toISOString(),
  },
]

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, location, verified, search } = req.query

    let filteredSuppliers = [...sampleSuppliers]

    // Filter by category
    if (category) {
      filteredSuppliers = filteredSuppliers.filter((supplier) =>
        supplier.category.toLowerCase().includes(category.toLowerCase()),
      )
    }

    // Filter by location
    if (location) {
      filteredSuppliers = filteredSuppliers.filter((supplier) =>
        supplier.location.city.toLowerCase().includes(location.toLowerCase()),
      )
    }

    // Filter by verified status
    if (verified !== undefined) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.verified === (verified === "true"))
    }

    // Filter by search term
    if (search) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(search.toLowerCase()) ||
          supplier.description.toLowerCase().includes(search.toLowerCase()),
      )
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
    const supplier = sampleSuppliers.find((supplier) => supplier._id === req.params.id)

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

// @desc    Register a new supplier
// @route   POST /api/suppliers/register
// @access  Public
router.post("/register", registerSupplier)

// @desc    Search suppliers
// @route   GET /api/suppliers/search
// @access  Public
router.get("/search", searchSuppliers)

// @desc    Get suppliers statistics
// @route   GET /api/suppliers/stats
// @access  Public
router.get("/stats", getStats)

module.exports = router
