import QuoteRequest from '../models/quoteRequestModel.js';
import { sendQuoteRequestEmail } from '../utils/quoteEmail.js';

export const submitQuote = async (req, res) => {
  const { items, name, email, phone, notes } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ message: 'No items' });
  const quote = await QuoteRequest.create({
    user: req.user?._id,
    items: items.map(i => ({ product: i.product, quantity: i.quantity || 1 })),
    name, email, phone, notes,
  });
  try { await sendQuoteRequestEmail(quote); } catch {}
  res.status(201).json(quote);
};

export const listQuotes = async (req, res) => {
  const quotes = await QuoteRequest.find({}).sort({ createdAt: -1 }).populate('items.product');
  res.json(quotes);
};

export const updateQuoteStatus = async (req, res) => {
  const { status } = req.body;
  const quote = await QuoteRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!quote) return res.status(404).json({ message: 'Quote not found' });
  res.json(quote);
};


