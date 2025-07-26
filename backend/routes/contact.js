import express from 'express';
import Contact from '../models/contactModel.js'; // Ensure this model exists
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
  const newContact = new Contact({ name, email, message });
  await newContact.save();
  res.status(201).json({ message: 'Message received' });
});

export default router; 