import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

function calculateTotal(cart) {
  return cart.items.reduce((sum, item) => {
    const retail = item.product?.pricing?.retail ?? 0;
    return sum + retail * item.quantity;
  }, 0);
}

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  const total = calculateTotal(cart);
  res.json({ items: cart.items, total });
};

export const addItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId is required' });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ product: productId, quantity });

  await cart.save();
  await cart.populate('items.product');
  const total = calculateTotal(cart);
  res.json({ items: cart.items, total });
};

export const removeItem = async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [], total: 0 });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  await cart.populate('items.product');
  const total = calculateTotal(cart);
  res.json({ items: cart.items, total });
};

export const updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 1) return res.status(400).json({ message: 'quantity must be >= 1' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const existing = cart.items.find(i => i.product.toString() === productId);
  if (!existing) return res.status(404).json({ message: 'Item not in cart' });
  existing.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  const total = calculateTotal(cart);
  res.json({ items: cart.items, total });
};

export const clearCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [], total: 0 });
  cart.items = [];
  await cart.save();
  res.status(204).send();
};


