const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Shoes', 'Bags', 'Accessories', 'Clothing']
  },
  height: String,
  soleType: String,
  eyelets: Number,
  material: String,
  thread: String,
  features: [String],
  wholesalePrice: {
    type: Number,
    required: true,
    min: 0
  },
  retailPrice: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: String,
  category: {
    type: String,
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Discontinued'],
    default: 'Active'
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
