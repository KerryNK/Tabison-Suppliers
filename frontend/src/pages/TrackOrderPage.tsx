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



import {
  Box, Typography, TextField, Button, Card, CardContent,
  Stepper, Step, StepLabel, StepContent, Alert, Grid,
  Chip, Paper, Table, TableBody, TableCell, TableContainer,
  TableRow, CircularProgress
} from '@mui/material';
import { 
  LocalShipping as ShippingIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      trackOrderById(orderId);
    }
  }, [orderId]);

  const trackOrder = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number or order ID');
      return;
    }
    await fetchOrder(trackingNumber);
  };

  const trackOrderById = async (id) => {
    await fetchOrder(id);
  };

  const fetchOrder = async (identifier) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/orders/track/${identifier}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else if (response.status === 404) {
        setError('Order not found. Please check your tracking number or order ID.');
      } else {
        throw new Error('Failed to fetch order details');
      }
    } catch (err) {
      setError('Unable to track order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': -1
    };
    return statusMap[status] || 0;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return colorMap[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'pending': <PendingIcon />,
      'confirmed': <CheckIcon />,
      'processing': <CheckIcon />,
      'shipped': <ShippingIcon />,
      'delivered': <CheckIcon />,
      'cancelled': <CancelIcon />
    };
    return iconMap[status] || <PendingIcon />;
  };

  const steps = [
    {
      label: 'Order Placed',
      description: 'Your order has been received'
    },
    {
      label: 'Confirmed',
      description: 'Payment confirmed and order validated'
    },
    {
      label: 'Processing',
      description: 'Order is being prepared for shipment'
    },
    {
      label: 'Shipped',
      description: 'Order is on its way to you'
    },
    {
      label: 'Delivered',
      description: 'Order has been delivered'
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Track Your Order
      </Typography>

      {/* Tracking Input */}
      {!orderId && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <form onSubmit={trackOrder}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Enter Order Number or Tracking Number"
                    placeholder="e.g., TS123456789 or TRACK123"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Track Order'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Order Details */}
      {order && (
        <>
          {/* Order Summary */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Order Number:</TableCell>
                          <TableCell><strong>{order.orderNumber}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Order Date:</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Amount:</TableCell>
                          <TableCell><strong>Ksh {order.payment?.amount?.total?.toLocaleString()}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Payment Status:</TableCell>
                          <TableCell>
                            <Chip 
                              label={order.payment?.status || 'pending'} 
                              color={getStatusColor(order.payment?.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        {order.tracking?.trackingNumber && (
                          <TableRow>
                            <TableCell>Tracking Number:</TableCell>
                            <TableCell><strong>{order.tracking.trackingNumber}</strong></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Delivery Information
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Delivery Address:</TableCell>
                          <TableCell>
                            {order.shipping?.address?.street}<br/>
                            {order.shipping?.address?.city}, {order.shipping?.address?.county}<br/>
                            {order.shipping?.address?.country}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Shipping Method:</TableCell>
                          <TableCell>{order.shipping?.method}</TableCell>
                        </TableRow>
                        {order.tracking?.estimatedDelivery && (
                          <TableRow>
                            <TableCell>Est. Delivery:</TableCell>
                            <TableCell>
                              {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        )}
                        {order.tracking?.carrier && (
                          <TableRow>
                            <TableCell>Carrier:</TableCell>
                            <TableCell>{order.tracking.carrier}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Order Status Stepper */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {getStatusIcon(order.status)}
                <Chip 
                  label={order.status?.toUpperCase() || 'UNKNOWN'} 
                  color={getStatusColor(order.status)}
                  sx={{ ml: 2 }}
                />
              </Box>

              {order.status !== 'cancelled' && (
                <Stepper 
                  activeStep={getStatusStep(order.status)} 
                  orientation="vertical"
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>{step.label}</StepLabel>
                      <StepContent>
                        <Typography color="text.secondary">
                          {step.description}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              )}

              {order.status === 'cancelled' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  This order has been cancelled. Please contact support for more information.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Tracking History */}
          {order.tracking?.history && order.tracking.history.length > 0 && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tracking History
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableBody>
                      {order.tracking.history
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map((event, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(event.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <strong>{event.status}</strong>
                              {event.location && ` - ${event.location}`}
                            </TableCell>
                            <TableCell>
                              {event.note}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    {order.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img 
                            src={item.product?.images?.[0] || '/placeholder.jpg'} 
                            alt={item.product?.name}
                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {item.product?.name || 'Product'}
                          </Typography>
                          {item.specifications?.size && (
                            <Typography variant="body2" color="text.secondary">
                              Size: {item.specifications.size}
                            </Typography>
                          )}
                          {item.specifications?.color && (
                            <Typography variant="body2" color="text.secondary">
                              Color: {item.specifications.color}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>Qty: {item.quantity}</TableCell>
                        <TableCell>
                          Ksh {(item.price * item.quantity).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default TrackOrderPage;
