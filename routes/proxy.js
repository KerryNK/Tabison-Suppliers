import express from 'express';
import axios from 'axios'; // You might need to `npm install axios`

const router = express.Router();

// This is a proxy route. The frontend calls this endpoint.
// This endpoint then calls the external service using the secret API key.
router.get('/external-data', async (req, res) => {
  try {
    const apiKey = process.env.EXTERNAL_API_KEY; // Safely loaded from .env file on the server
    if (!apiKey) {
      throw new Error('API key for external service is not configured on the server.');
    }
    const response = await axios.get('https://api.external-service.com/data', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data from external service.', error: error.message });
  }
});

export default router;
