import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';

/**
 * @desc    Get all products with filtering, sorting, and searching
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  const { category, search, sort, minPrice, maxPrice, tag, ids } = req.query;
  const filter = {};

  if (ids) {
    const idArr = ids.split(',').map(id => id.trim());
    filter._id = { $in: idArr };
  }
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (minPrice || maxPrice) {
    filter.retailPrice = {};
    if (minPrice) filter.retailPrice.$gte = Number(minPrice);
    if (maxPrice) filter.retailPrice.$lte = Number(maxPrice);
  }
  if (tag) filter.tags = tag;

  let sortObj = {};
  if (sort === 'price_asc') sortObj = { retailPrice: 1 };
  else if (sort === 'price_desc') sortObj = { retailPrice: -1 };
  else if (sort === 'name_asc') sortObj = { name: 1 };
  else if (sort === 'name_desc') sortObj = { name: -1 };
  else if (sort === 'newest') sortObj = { createdAt: -1 };
  else if (sort === 'oldest') sortObj = { createdAt: 1 };

  const products = await Product.find(filter).sort(sortObj).populate('supplier');
  res.json(products);
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('supplier');
  if (!product) return next(new ErrorHandler('Product not found', 404));
  res.json(product);
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
  const product = new Product({ ...req.body, images });
  await product.save();
  res.status(201).json(product);
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : undefined;
  const update = { ...req.body };
  if (images && images.length) update.images = images;
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!product) return next(new ErrorHandler('Product not found', 404));
  res.json(product);
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new ErrorHandler('Product not found', 404));
  res.json({ message: 'Product deleted' });
};