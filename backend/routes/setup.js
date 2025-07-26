import express from 'express';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Supplier from '../models/supplierModel.js';
import users from '../data/users.js';
import products from '../data/products.js';

const router = express.Router();

router.post('/reset', async (req, res) => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Supplier.deleteMany({});

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    res.json({ message: 'Data Reset and Seeded!' });
  } catch (error) {
    console.error(`${error}`);
    res.status(500).json({ message: 'Data seeding failed' });
  }
});

export default router;
