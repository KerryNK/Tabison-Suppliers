import mongoose from 'mongoose';

const costItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  cost: { type: Number, required: true },
}, { _id: false });

const laborItemSchema = new mongoose.Schema({
    task: { type: String, required: true },
    cost: { type: Number, required: true },
}, { _id: false });

const pricingSchema = new mongoose.Schema({
    wholesale: { type: Number },
    retail: { type: Number },
    // For storing price ranges like "1500-1800"
    factoryPrice: { type: String } 
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
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
  specifications: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  pricing: {
    type: pricingSchema,
    required: true,
  },
  totalCost: {
    type: Number,
  },
  costBreakdown: {
    type: [costItemSchema],
    default: [],
  },
  laborBreakdown: {
      type: [laborItemSchema],
      default: [],
  },
  imageUrl: {
    type: String,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    // required: true, // You may want to require a supplier for each product
  }
}, {
  timestamps: true,
});

const Product = mongoose.model
