const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://tabisonsuppliers.vercel.app/', // Your Vercel frontend URL
    'http://localhost:5173', // Local development
    'http://localhost:3000' // Alternative local port
  ],
  credentials: true
}));

app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});