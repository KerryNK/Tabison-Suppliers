import React from 'react';
import { Box, Typography, IconButton, TextField, Button, Divider, Stack, CardMedia, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { useApi } from '../api/client';
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

  const total = items.reduce((sum, i) => sum + i.product.retailPrice * i.quantity, 0);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>Your Cart</Typography>
      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Your cart is empty.</Paper>
      ) : (
        <Box>
          <Stack spacing={2}>
            {items.map(({ product, quantity }) => (
              <Paper key={product._id} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: 2 }}>
                {product.images && product.images[0] ? (
                  <CardMedia component="img" image={product.images[0]} alt={product.name} sx={{ width: 80, height: 80, objectFit: 'contain', bgcolor: '#f9f9f9', borderRadius: 2, mr: 2 }} />
                ) : (
                  <Box sx={{ width: 80, height: 80, bgcolor: '#f9f9f9', borderRadius: 2, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No Image</Typography>
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700} color="primary.main">{product.name}</Typography>
                  <Typography color="secondary.main">Ksh {product.retailPrice}</Typography>
                </Box>
                <TextField
                  type="number"
                  size="small"
                  value={quantity}
                  onChange={e => updateQuantity(product._id, Number(e.target.value))}
                  inputProps={{ min: 1, style: { width: 60 } }}
                  sx={{ mx: 2 }}
                />
                <IconButton onClick={() => removeFromCart(product._id)} color="error"><DeleteIcon /></IconButton>
              </Paper>
            ))}
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Order Summary</Typography>
              <Typography sx={{ mt: 1 }}><b>Total:</b> Ksh {total}</Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" color="primary" onClick={handlePlaceOrder} disabled={placing} size="large">
                {placing ? 'Placing Order...' : 'Checkout'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={clearCart} size="large">Clear Cart</Button>
            </Stack>
          </Box>
          {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
          {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
        </Box>
      )}
    </Box>
  );
};

export default CartPage;
