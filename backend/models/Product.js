
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  retailPrice: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['military-boots', 'safety-footwear', 'professional-equipment', 'accessories']
  },
  type: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specifications: {
    size: [String],
    color: [String],
    material: String,
    weight: String,
    certification: [String]
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', type: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
