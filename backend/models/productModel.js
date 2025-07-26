import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  wholesale: { type: Number, default: 0 },
  retail: { type: Number, default: 0 },
  factoryPrice: { type: String } // For price ranges like "1500-1800"
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
      default: '/images/sample.jpg',
    },
    images: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Military Footwear', 
        'Safety Footwear', 
        'Official Footwear', 
        'Security Footwear', 
        'Industrial Footwear', 
        'Professional Footwear'
      ],
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    pricing: pricingSchema,
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;