import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    options: [
      { id: 'standard', name: 'Standard Delivery', etaDays: 3, price: 0 },
      { id: 'express', name: 'Express Delivery', etaDays: 1, price: 500 },
    ],
  });
});

export default router;


