import express from 'express';
import cors from 'cors';

// Import route modules
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/User.js';

const app = express();

app.use(cors({
  origin: [
    'https://tabisonsuppliers.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

  app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Tabison Suppliers API is running",
    docs: "/api/health"
  });
});

// No wildcard `app.get('*')` here
// Let Render serve API only

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
