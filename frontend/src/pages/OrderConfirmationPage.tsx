import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Divider,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    CheckCircle,
    Download,
    LocalShipping,
    ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../api/client';

interface Order {
    _id: string;
    orderNumber: string;
    orderItems: Array<{
        name: string;
        qty: number;
        price: number;
        image: string;
    }>;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        county: string;
        postalCode?: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    createdAt: string;
}

const OrderConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const api = useApi();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data || response);
            } catch (err: any) {
                setError(err.message || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'mpesa': return 'M-Pesa';
            case 'airtel': return 'Airtel Money';
            case 'card': return 'Credit/Debit Card';
            case 'paypal': return 'PayPal';
            default: return method;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Processing': return 'info';
            case 'Shipped': return 'primary';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Alert severity="error">{error || 'Order not found'}</Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/products')}
                    sx={{ mt: 3 }}
                >
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Success Header */}
            <Paper sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Order Confirmed!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Order #{order.orderNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Thank you for your order. We'll send you a confirmation email shortly.
                </Typography>
            </Paper>

            {/* Order Status */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Order Status
                        </Typography>
                        <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Payment Status
                        </Typography>
                        <Chip
                            label={order.isPaid ? 'Paid' : 'Pending'}
                            color={order.isPaid ? 'success' : 'warning'}
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                    {order.trackingNumber && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Tracking Number
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {order.trackingNumber}
                            </Typography>
                        </Grid>
                    )}
                    {order.estimatedDelivery && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Estimated Delivery
                            </Typography>
                            <Typography variant="body1">
                                {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Order Items */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Order Items
                </Typography>
                <List>
                    {order.orderItems.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemText
                                primary={`${item.name} × ${item.qty}`}
                                secondary={`KES ${(item.price * item.qty).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>KES {order.itemsPrice.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax:</Typography>
                    <Typography>KES {order.taxPrice.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography>Shipping:</Typography>
                    <Typography>
                        {order.shippingPrice === 0 ? 'FREE' : `KES ${order.shippingPrice.toLocaleString()}`}
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                        KES {order.totalPrice.toLocaleString()}
                    </Typography>
                </Box>
            </Paper>

            {/* Shipping Address */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Shipping Address
                </Typography>
                <Typography>{order.shippingAddress.fullName}</Typography>
                <Typography>{order.shippingAddress.address}</Typography>
                <Typography>
                    {order.shippingAddress.city}, {order.shippingAddress.county}
                    {order.shippingAddress.postalCode && ` ${order.shippingAddress.postalCode}`}
                </Typography>
            </Paper>

            {/* Payment Method */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Payment Method
                </Typography>
                <Typography>{getPaymentMethodLabel(order.paymentMethod)}</Typography>
                {order.isPaid && order.paidAt && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Paid on {new Date(order.paidAt).toLocaleString()}
                    </Typography>
                )}
            </Paper>

            {/* Action Buttons */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => alert('Receipt download coming soon')}
                    >
                        Download Receipt
                    </Button>
                </Grid>
                {order.trackingNumber && (
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<LocalShipping />}
                            onClick={() => navigate(`/track-order?number=${order.trackingNumber}`)}
                        >
                            Track Order
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default OrderConfirmationPage;
