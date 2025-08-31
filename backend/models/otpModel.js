import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  recipient: { type: String, required: true }, // email or phone
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true, index: { expiresAt: 1 } });

otpSchema.index({ recipient: 1, used: 1 });

export default mongoose.model('Otp', otpSchema);


