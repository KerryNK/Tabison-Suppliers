import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Payment,
  ShoppingBag,
  Home,
  Receipt,
  Email,
  Phone,
} from '@mui/icons-material';
import { useApi } from '../api/client';
import { Order, PaymentStatus } from '../types';
import toast from 'react-hot-toast';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrder(id!),
    enabled: !!id,
  });

  // Poll for payment status if order is not paid
  useEffect(() => {
    if (order && !order.isPaid) {
      const interval = setInterval(async () => {
        try {
          const status = await api.getPaymentStatus(order._id);
          setPaymentStatus(status);
          
          if (status.isPaid) {
            toast.success('Payment confirmed! Your order is being processed.');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [order, api]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found or error loading order details.
        </Alert>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Payment color="warning" />;
      case 'cancelled':
        return <Payment color="error" />;
      default:
        return <Payment />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Header */}
      <Box textAlign="center" mb={4}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your order. We've received your order and will begin processing it shortly.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Number
                </Typography>
                <Typography variant="h6">
                  {order.orderNumber}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {order.paymentMethod}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {getStatusIcon(order.isPaid ? 'paid' : 'pending')}
                  <Chip
                    label={order.isPaid ? 'Paid' : 'Pending'}
                    color={getStatusColor(order.isPaid ? 'paid' : 'pending')}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Order Items */}
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <List>
                {order.orderItems.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.qty}`}
                    />
                    <Typography variant="body1">
                      KES {(item.price * item.qty).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              {/* Shipping Address */}
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.address}
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.country}
              </Typography>
              <Typography variant="body1">
                Phone: {order.shippingAddress.phone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="h6">
                KES {order.itemsPrice.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Shipping
              </Typography>
              <Typography variant="h6">
                {order.shippingPrice === 0 ? 'Free' : `KES ${order.shippingPrice.toLocaleString()}`}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tax (16%)
              </Typography>
              <Typography variant="h6">
                KES {order.taxPrice.toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">
                Total: KES {order.totalPrice.toLocaleString()}
              </Typography>
            </Box>

            {/* Payment Instructions for M-PESA */}
            {order.paymentMethod === 'mpesa' && !order.isPaid && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Please check your phone for the M-PESA STK push notification to complete your payment.
                </Typography>
              </Alert>
            )}

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/orders')}
                startIcon={<Receipt />}
              >
                View All Orders
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/products')}
                startIcon={<ShoppingBag />}
              >
                Continue Shopping
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
                startIcon={<Home />}
              >
                Back to Home
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Next Steps */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What's Next?
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Payment Processing</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {order.isPaid 
                  ? 'Payment confirmed! Your order is being processed.'
                  : 'Complete your payment to proceed with order processing.'
                }
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Order Processing</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                We'll process your order and prepare it for shipping within 1-2 business days.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Email Updates</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                You'll receive email updates about your order status and tracking information.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          If you have any questions about your order, please don't hesitate to contact us.
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2">support@tabisonsuppliers.com</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2">+254 XXX XXX XXX</Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderConfirmationPage;