import mongoose from 'mongoose';

const quoteItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const quoteRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  items: [quoteItemSchema],
  notes: String,
  status: { type: String, enum: ['Pending', 'Responded', 'Closed'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('QuoteRequest', quoteRequestSchema);


