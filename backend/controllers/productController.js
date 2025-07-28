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
]

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  const { q, category, page = 1, limit = 10 } = req.query
  const query = {}

  if (q) {
    query.$text = { $search: q }
  }

  if (category) {
    query.category = category
  }

  const pageNum = Number.parseInt(page, 10)
  const limitNum = Number.parseInt(limit, 10)
  const skip = (pageNum - 1) * limitNum

  // Filter products based on query
  let filteredProducts = [...sampleProducts]

  if (category) {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.toLowerCase().includes(category.toLowerCase()),
    )
  }

  if (q) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(q.toLowerCase()) ||
        product.description.toLowerCase().includes(q.toLowerCase()),
    )
  }

  // Apply pagination
  const paginatedProducts = filteredProducts.slice(skip, skip + limitNum)
  const total = filteredProducts.length

  res.json({
    products: paginatedProducts,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  })
}

/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  const product = sampleProducts.find((product) => product._id === req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
}

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  const { name, pricing, description, image, brand, category, countInStock, sku } = req.body

  const product = {
    _id: String(sampleProducts.length + 1),
    name,
    pricing,
    user: req.user?._id || "1",
    image,
    sku: sku || name.replace(/\s+/g, "_").toUpperCase(),
    brand,
    category,
    countInStock,
    description,
    createdAt: new Date().toISOString(),
  }

  sampleProducts.push(product)
  res.status(201).json(product)
}

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  const { name, pricing, description, image, brand, category, countInStock } = req.body

  const productIndex = sampleProducts.findIndex((product) => product._id === req.params.id)

  if (productIndex !== -1) {
    const product = sampleProducts[productIndex]
    product.name = name || product.name
    product.pricing = pricing || product.pricing
    product.description = description || product.description
    product.image = image || product.image
    product.brand = brand || product.brand
    product.category = category || product.category
    product.countInStock = countInStock ?? product.countInStock

    sampleProducts[productIndex] = product
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
}

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  const productIndex = sampleProducts.findIndex((product) => product._id === req.params.id)

  if (productIndex !== -1) {
    sampleProducts.splice(productIndex, 1)
    res.json({ message: "Product removed" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
