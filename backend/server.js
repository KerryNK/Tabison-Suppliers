import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();

// Init Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://tabisonsuppliers.vercel.app/', // Your Vite frontend dev server
  credentials: true,
}));

// Define Routes
app.get('/api', (req, res) => res.send('API Running'));
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
