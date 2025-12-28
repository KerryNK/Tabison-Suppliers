import mongoose from 'mongoose';

const quoteItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, min: 1 },
}, { _id: false });

const quoteRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  // For product-based quotes
  items: [quoteItemSchema],
  // For text-based quotes (from form)
  productType: { type: String },
  quantity: { type: Number },
  // Additional details
  message: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Responded', 'Closed'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('QuoteRequest', quoteRequestSchema);
