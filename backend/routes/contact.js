import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
  await Contact.create({ name, email, message });
  res.json({ message: 'Message received' });
});

export default router; 