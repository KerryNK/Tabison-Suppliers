import React from 'react';
import { Box, Button, Typography, IconButton, TextField } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useApi } from '../api/client';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const api = useApi();
  const navigate = useNavigate();
  const [placing, setPlacing] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError(''); setSuccess('');
    try {
      // Prepare order payload
      const order = {
        orderNumber: 'ORD-' + Date.now(),
        supplier: items[0]?.product.supplier || '',
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity, unitPrice: i.product.retailPrice, totalPrice: i.product.retailPrice * i.quantity })),
        totalAmount: items.reduce((sum, i) => sum + i.product.retailPrice * i.quantity, 0),
        status: 'Pending',
        paymentStatus: 'Pending',
      };
      const created = await api.post('/orders', order);
      clearCart();
      navigate('/payment', { state: { orderId: created._id } });
    } catch (e) {
      setError('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Your Cart</Typography>
      {items.length === 0 ? <Typography>Your cart is empty.</Typography> : (
        <>
          {items.map(({ product, quantity }) => (
            <Box key={product._id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>{product.name}</Typography>
                <Typography color="text.secondary">Ksh {product.retailPrice}</Typography>
              </Box>
              <TextField
                type="number"
                size="small"
                value={quantity}
                onChange={e => updateQuantity(product._id, Number(e.target.value))}
                inputProps={{ min: 1, style: { width: 60 } }}
                sx={{ mx: 2 }}
              />
              <IconButton onClick={() => removeFromCart(product._id)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Typography sx={{ mt: 2, mb: 2 }}>
            <b>Total:</b> Ksh {items.reduce((sum, i) => sum + i.product.retailPrice * i.quantity, 0)}
          </Typography>
          <Button variant="contained" color="primary" onClick={handlePlaceOrder} disabled={placing} sx={{ mr: 2 }}>Place Order</Button>
          <Button variant="outlined" color="secondary" onClick={clearCart}>Clear Cart</Button>
          {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
          {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
        </>
      )}
    </Box>
  );
};

export default CartPage; 