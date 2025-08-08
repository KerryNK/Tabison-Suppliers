import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useApi } from '../api/client';

const TrackOrderPage: React.FC = () => {
  const api = useApi();
  const [orderNumber, setOrderNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const track = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setResult(null);
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(orderNumber)}`);
      setResult(res);
    } catch {
      setError('Order not found');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Track Your Order</Typography>
      <Box component="form" onSubmit={track}>
        <TextField fullWidth label="Order Number" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Track</Button>
      </Box>
      {result && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">Status: {result.status} • Payment: {result.paymentStatus}</Alert>
        </Box>
      )}
      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
    </Box>
  );
};

export default TrackOrderPage;


