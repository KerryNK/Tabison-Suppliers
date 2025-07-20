import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema); 