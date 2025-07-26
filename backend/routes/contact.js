import express from 'express';
import Contact from '../models/contactModel.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
  await Contact.create({ name, email, message });
  res.json({ message: 'Message received' });
});

export default router; 