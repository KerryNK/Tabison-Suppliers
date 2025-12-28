import QuoteRequest from '../models/quoteRequestModel.js';
import { sendQuoteRequestEmail } from '../utils/quoteEmail.js';

export const submitQuote = async (req, res) => {
  try {
    const { items, name, email, phone, company, productType, quantity, message, notes } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Check if it's a product-based or text-based quote
    if (!items && !productType) {
      return res.status(400).json({ message: 'Either items or productType is required' });
    }

    const quoteData = {
      user: req.user?._id,
      name,
      email,
      phone,
      company,
      message: message || notes,
      notes: notes || message,
    };

    // Add product-based or text-based data
    if (items && items.length > 0) {
      quoteData.items = items.map(i => ({ product: i.product, quantity: i.quantity || 1 }));
    } else {
      quoteData.productType = productType;
      quoteData.quantity = quantity;
    }

    const quote = await QuoteRequest.create(quoteData);

    // Send email notification (non-blocking)
    try {
      await sendQuoteRequestEmail(quote);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: quote
    });
  } catch (error) {
    console.error('Submit quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quote request',
      error: error.message
    });
  }
};

export const listQuotes = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find({})
      .sort({ createdAt: -1 })
      .populate('items.product')
      .populate('user', 'name email');
    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
