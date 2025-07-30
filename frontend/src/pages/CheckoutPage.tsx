import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  CheckCircle,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../api/client';
import { Cart, Order, ShippingAddress } from '../types';
import toast from 'react-hot-toast';

const steps = ['Cart Review', 'Shipping Details', 'Payment', 'Confirmation'];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
    phone: '',
  });

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.getCart(),
    enabled: !!user,
  });

  useEffect(() => {
    if (user?.profile?.phone) {
      setMpesaPhone(user.profile.phone);
      setShippingAddress(prev => ({
        ...prev,
        phone: user.profile.phone || '',
      }));
    }
  }, [user]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingSubmit = () => {
    // Validate shipping address
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      toast.error('Please fill in all required shipping fields');
      return;
    }
    handleNext();
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'mpesa' && !mpesaPhone) {
      toast.error('Please enter your M-PESA phone number');
      return;
    }

    try {
      setLoading(true);

      // Calculate totals
      const itemsPrice = cartData?.totalPrice || 0;
      const shippingPrice = itemsPrice > 5000 ? 0 : 500; // Free shipping over 5000
      const taxPrice = itemsPrice * 0.16; // 16% VAT
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      // Create order
      const orderData = {
        orderItems: cartData?.items.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images[0],
          price: item.price,
          product: item.product._id,
        })) || [],
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const order = await api.createOrder(orderData);

      if (paymentMethod === 'mpesa') {
        // Initiate M-PESA payment
        await api.initiateMpesaPayment({
          phoneNumber: mpesaPhone,
          amount: totalPrice,
          orderId: order._id,
        });
        
        toast.success('M-PESA STK Push sent! Please check your phone to complete payment.');
        navigate(`/order-confirmation/${order._id}`);
      } else {
        // PayPal payment will be handled by PayPal component
        navigate(`/order-confirmation/${order._id}`);
      }

      // Clear cart after successful order creation
      await clearCart();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCartReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {cartData?.items.map((item) => (
        <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body1">{item.product.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Qty: {item.quantity}
            </Typography>
          </Box>
          <Typography variant="body1">
            KES {(item.price * item.quantity).toLocaleString()}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal:</Typography>
        <Typography>KES {(cartData?.totalPrice || 0).toLocaleString()}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Shipping:</Typography>
        <Typography>
          {(cartData?.totalPrice || 0) > 5000 ? 'Free' : 'KES 500'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Tax (16%):</Typography>
        <Typography>
          KES {((cartData?.totalPrice || 0) * 0.16).toLocaleString()}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">
          KES {((cartData?.totalPrice || 0) + ((cartData?.totalPrice || 0) > 5000 ? 0 : 500) + ((cartData?.totalPrice || 0) * 0.16)).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );

  const renderShippingDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={shippingAddress.address}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPaymentMethod = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset">
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'paypal')}
        >
          <FormControlLabel
            value="mpesa"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">M-PESA</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay using M-PESA mobile money
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">PayPal</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay using PayPal account or card
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {paymentMethod === 'mpesa' && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="M-PESA Phone Number"
            value={mpesaPhone}
            onChange={(e) => setMpesaPhone(e.target.value)}
            placeholder="e.g., 254700000000"
            helperText="Enter your M-PESA registered phone number"
            required
          />
        </Box>
      )}

      {paymentMethod === 'paypal' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          You will be redirected to PayPal to complete your payment after placing the order.
        </Alert>
      )}
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderCartReview();
      case 1:
        return renderShippingDetails();
      case 2:
        return renderPaymentMethod();
      default:
        return 'Unknown step';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Your cart is empty. Please add some products before checkout.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {getStepContent(activeStep)}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Items ({cartData.totalItems})
              </Typography>
              <Typography variant="h6">
                KES {cartData.totalPrice.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Shipping
              </Typography>
              <Typography variant="h6">
                {cartData.totalPrice > 5000 ? 'Free' : 'KES 500'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tax (16%)
              </Typography>
              <Typography variant="h6">
                KES {(cartData.totalPrice * 0.16).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">
                Total: KES {(cartData.totalPrice + (cartData.totalPrice > 5000 ? 0 : 500) + (cartData.totalPrice * 0.16)).toLocaleString()}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Back
                </Button>
              )}
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  sx={{ flex: 1 }}
                  startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={activeStep === 1 ? handleShippingSubmit : handleNext}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {activeStep === 1 ? 'Continue to Payment' : 'Next'}
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;