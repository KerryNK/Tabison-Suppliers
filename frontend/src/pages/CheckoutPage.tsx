import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Checkbox,
    Divider,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { CreditCard, AccountBalance, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../api/client';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const api = useApi();
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Shipping address
    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        address: '',
        city: '',
        county: '',
        postalCode: '',
    });

    // Billing address
    const [billingAddress, setBillingAddress] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        county: '',
        postalCode: '',
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');

    // Calculate totals
    const subtotal = total || 0;
    const tax = subtotal * 0.16; // 16% VAT
    const shipping = subtotal >= 10000 ? 0 : 500; // Free shipping over 10,000 KES
    const grandTotal = subtotal + tax + shipping;

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress({
            ...billingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // Validate required fields
            if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address ||
                !shippingAddress.city || !shippingAddress.county) {
                throw new Error('Please fill in all shipping address fields');
            }

            if (paymentMethod === 'mpesa' && !mpesaPhone) {
                throw new Error('Please enter M-Pesa phone number');
            }

            // Prepare order data
            const orderData = {
                orderItems: items.map((item: any) => ({
                    name: item.product?.name || item.name,
                    qty: item.quantity,
                    image: item.product?.image || item.image,
                    price: item.product?.price || item.price,
                    product: item.product?._id || item.productId,
                })),
                shippingAddress,
                billingAddress: sameAsShipping ? shippingAddress : billingAddress,
                paymentMethod,
                itemsPrice: subtotal,
                taxPrice: tax,
                shippingPrice: shipping,
                totalPrice: grandTotal,
                customerNotes,
            };

            // Create order
            const orderResponse = await api.post('/orders', orderData);
            const order = orderResponse.data;

            // Process payment based on method
            if (paymentMethod === 'mpesa') {
                await api.post('/payment/mpesa', {
                    phone: mpesaPhone,
                    amount: grandTotal,
                    orderNumber: order.orderNumber,
                });
                // Show success message and redirect
                alert('M-Pesa payment initiated. Please check your phone to complete payment.');
            } else if (paymentMethod === 'card') {
                // Redirect to Stripe checkout
                const paymentIntent = await api.post('/payment/stripe', {
                    amount: grandTotal,
                });
                // TODO: Integrate Stripe Elements
                alert('Card payment integration coming soon');
            } else if (paymentMethod === 'airtel') {
                await api.post('/payment/airtel', {
                    phone: mpesaPhone,
                    amount: grandTotal,
                    orderNumber: order.orderNumber,
                });
                alert('Airtel Money payment initiated. Please check your phone.');
            } else if (paymentMethod === 'paypal') {
                // TODO: Integrate PayPal
                alert('PayPal integration coming soon');
            }

            // Clear cart and navigate to order confirmation
            await clearCart();
            navigate(`/orders/${order._id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Checkout
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Left Column - Forms */}
                <Grid item xs={12} md={8}>
                    {/* Shipping Address */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Address
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullName"
                                    value={shippingAddress.fullName}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={shippingAddress.phone}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={shippingAddress.email}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street Address"
                                    name="address"
                                    value={shippingAddress.address}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={shippingAddress.city}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="County"
                                    name="county"
                                    value={shippingAddress.county}
                                    onChange={handleShippingChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    name="postalCode"
                                    value={shippingAddress.postalCode}
                                    onChange={handleShippingChange}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Billing Address */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Billing Address
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sameAsShipping}
                                    onChange={(e) => setSameAsShipping(e.target.checked)}
                                />
                            }
                            label="Same as shipping address"
                        />
                        {!sameAsShipping && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="fullName"
                                        value={billingAddress.fullName}
                                        onChange={handleBillingChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={billingAddress.phone}
                                        onChange={handleBillingChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={billingAddress.email}
                                        onChange={handleBillingChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Street Address"
                                        name="address"
                                        value={billingAddress.address}
                                        onChange={handleBillingChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={billingAddress.city}
                                        onChange={handleBillingChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="County"
                                        name="county"
                                        value={billingAddress.county}
                                        onChange={handleBillingChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        name="postalCode"
                                        value={billingAddress.postalCode}
                                        onChange={handleBillingChange}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Paper>

                    {/* Payment Method */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Payment Method
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel
                                    value="mpesa"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Phone />
                                            <span>M-Pesa</span>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="airtel"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Phone />
                                            <span>Airtel Money</span>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="card"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CreditCard />
                                            <span>Credit/Debit Card</span>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="paypal"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AccountBalance />
                                            <span>PayPal</span>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>

                        {(paymentMethod === 'mpesa' || paymentMethod === 'airtel') && (
                            <TextField
                                fullWidth
                                label="Phone Number"
                                placeholder="254XXXXXXXXX"
                                value={mpesaPhone}
                                onChange={(e) => setMpesaPhone(e.target.value)}
                                sx={{ mt: 2 }}
                                required
                            />
                        )}
                    </Paper>

                    {/* Customer Notes */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Notes (Optional)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Any special instructions for your order..."
                            value={customerNotes}
                            onChange={(e) => setCustomerNotes(e.target.value)}
                        />
                    </Paper>
                </Grid>

                {/* Right Column - Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <List dense>
                            {items.map((item: any) => (
                                <ListItem key={item._id} sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={`${item.product?.name || item.name} × ${item.quantity}`}
                                        secondary={`KES ${((item.product?.price || item.price) * item.quantity).toLocaleString()}`}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Subtotal:</Typography>
                            <Typography>KES {subtotal.toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Tax (16%):</Typography>
                            <Typography>KES {tax.toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography>Shipping:</Typography>
                            <Typography>
                                {shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" color="primary">
                                KES {grandTotal.toLocaleString()}
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Place Order'}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;
