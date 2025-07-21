import React, { useState } from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../api/client';

const paymentMethods = [
  { label: 'M-Pesa', value: 'mpesa' },
  { label: 'Debit/Credit Card', value: 'card' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Airtel Money', value: 'airtel' },
];

const PaymentPage: React.FC = () => {
  const [method, setMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const api = useApi();

  // Expect orderId to be passed via state
  const orderId = (location.state as any)?.orderId;

  const handlePay = async () => {
    setLoading(true);
    setError(''); setSuccess('');
    try {
      // Mock payment API call
      await api.post('/payments', { orderId, method });
      setSuccess('Payment successful!');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (e) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return <Alert severity="error">No order to pay for.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Complete Your Payment</Typography>
      <RadioGroup value={method} onChange={e => setMethod(e.target.value)}>
        {paymentMethods.map(pm => (
          <FormControlLabel key={pm.value} value={pm.value} control={<Radio />} label={pm.label} />
        ))}
      </RadioGroup>
      <Button variant="contained" color="primary" onClick={handlePay} disabled={loading} sx={{ mt: 3, width: '100%' }}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default PaymentPage; 