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
    },
    contact: {
      phone: "+254-700-123456",
      email: "info@tabisonsuppliers.com",
      website: "https://tabisonsuppliers.com",
    },
    verified: true,
    rating: 4.8,
    totalReviews: 156,
    createdAt: new Date().toISOString(),
  },
]

/**
 * @desc    Register a new supplier
 * @route   POST /api/suppliers/register
 * @access  Public
 */
const registerSupplier = async (req, res) => {
  const { email } = req.body

  const supplierExists = sampleSuppliers.find((supplier) => supplier.email === email)

  if (supplierExists) {
    res.status(400)
    throw new Error("A supplier with this email already exists")
  }

  const supplier = {
    _id: String(sampleSuppliers.length + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
  }

  sampleSuppliers.push(supplier)

  if (supplier) {
    res.status(201).json({
      _id: supplier._id,
      name: supplier.name,
      email: supplier.email,
      message: "Registration successful. Your application is under review.",
    })
  } else {
    res.status(400)
    throw new Error("Invalid supplier data")
  }
}

/**
 * @desc    Create a new supplier
 * @route   POST /api/suppliers
 * @access  Private/Admin
 */
const createSupplier = async (req, res) => {
  const supplier = {
    _id: String(sampleSuppliers.length + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
  }

  sampleSuppliers.push(supplier)
  res.status(201).json(supplier)
}

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Public
 */
const getAllSuppliers = async (req, res) => {
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

  res.json({ suppliers: filteredSuppliers })
}

/**
 * @desc    Get single supplier by ID
 * @route   GET /api/suppliers/:id
 * @access  Public
 */
const getSupplierById = async (req, res) => {
  const supplier = sampleSuppliers.find((supplier) => supplier._id === req.params.id)

  if (supplier) {
    res.json(supplier)
  } else {
    res.status(404)
    throw new Error("Supplier not found")
  }
}

/**
 * @desc    Update a supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private/Admin
 */
const updateSupplier = async (req, res) => {
  const supplierIndex = sampleSuppliers.findIndex((supplier) => supplier._id === req.params.id)

  if (supplierIndex !== -1) {
    const supplier = { ...sampleSuppliers[supplierIndex], ...req.body }
    sampleSuppliers[supplierIndex] = supplier
    res.json(supplier)
  } else {
    res.status(404)
    throw new Error("Supplier not found")
  }
}

/**
 * @desc    Delete a supplier
 * @route   DELETE /api/suppliers/:id
 * @access  Private/Admin
 */
const deleteSupplier = async (req, res) => {
  const supplierIndex = sampleSuppliers.findIndex((supplier) => supplier._id === req.params.id)

  if (supplierIndex !== -1) {
    sampleSuppliers.splice(supplierIndex, 1)
    res.json({ message: "Supplier removed" })
  } else {
    res.status(404)
    throw new Error("Supplier not found")
  }
}

/**
 * @desc    Search for suppliers
 * @route   GET /api/suppliers/search
 * @access  Public
 */
const searchSuppliers = async (req, res) => {
  const { q, category, location } = req.query
  const query = { status: "approved" } // Only show approved suppliers

  let filteredSuppliers = sampleSuppliers.filter((supplier) => supplier.verified === true)

  if (q) {
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(q.toLowerCase()) ||
        supplier.description.toLowerCase().includes(q.toLowerCase()),
    )
  }
  if (category) {
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.category.toLowerCase().includes(category.toLowerCase()),
    )
  }
  if (location) {
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.location.city.toLowerCase().includes(location.toLowerCase()),
    )
  }

  res.json({ suppliers: filteredSuppliers })
}

/**
 * @desc    Get platform statistics for the dashboard
 * @route   GET /api/suppliers/stats
 * @access  Public (or Admin)
 */
const getStats = async (req, res) => {
  const supplierCount = sampleSuppliers.filter((supplier) => supplier.verified === true).length
  const productCount = 25 // Mock data
  const orderCount = 150 // Mock data

  const ordersByStatus = [
    { status: "pending", count: 45 },
    { status: "completed", count: 85 },
    { status: "cancelled", count: 20 },
  ]

  res.json({
    suppliers: supplierCount,
    products: productCount,
    orders: orderCount,
    orderData: ordersByStatus,
  })
}

module.exports = {
  registerSupplier,
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  searchSuppliers,
  getStats,
}
