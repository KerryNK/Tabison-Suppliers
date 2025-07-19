const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Shoes', 'Bags', 'Accessories', 'Clothing'] },
  sku: { type: String, required: true, unique: true },
  wholesalePrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  stockQuantity: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Discontinued'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 