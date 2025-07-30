import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  Card,
  CardContent,
  Divider,
  TextField,
  Alert,
  Skeleton,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  Star,
  LocalShipping,
  Security,
  Support,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../api/client';
import { Product } from '../types';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { addToCart, getCartItemQuantity } = useCart();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
  });

  const currentQuantity = product ? getCartItemQuantity(product._id) : 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      setLoading(true);
      await addToCart(product, quantity);
      toast.success('Added to cart successfully!');
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      setLoading(true);
      await addToCart(product, quantity);
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" height={80} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={100} />
            <Skeleton variant="rectangular" height={50} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Product not found or error loading product details.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <img
              src={product.images[selectedImage] || '/placeholder-product.jpg'}
              alt={product.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </Box>
          
          {product.images.length > 1 && (
            <ImageList sx={{ width: '100%', height: 100 }} cols={4} rowHeight={80}>
              {product.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #1976d2' : '2px solid transparent',
                      borderRadius: '4px',
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.averageRating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.numReviews} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary" sx={{ mr: 2 }}>
              KES {product.price.toLocaleString()}
            </Typography>
            {product.retailPrice > product.price && (
              <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                KES {product.retailPrice.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Chip
            label={product.category}
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Stock Status */}
          <Box sx={{ mb: 3 }}>
            {product.inStock ? (
              <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                ✓ In Stock
                {product.stockQuantity > 0 && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.stockQuantity} available)
                  </Typography>
                )}
              </Typography>
            ) : (
              <Typography color="error.main">Out of Stock</Typography>
            )}
          </Box>

          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: product.stockQuantity || 99 }}
              sx={{ width: 80, mr: 2 }}
            />
            {currentQuantity > 0 && (
              <Typography variant="body2" color="text.secondary">
                ({currentQuantity} in cart)
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.inStock || loading}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleBuyNow}
              disabled={!product.inStock || loading}
              sx={{ flex: 1 }}
            >
              Buy Now
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="text" startIcon={<Favorite />}>
              Wishlist
            </Button>
            <Button variant="text" startIcon={<Share />}>
              Share
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Product Details */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Product Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Features
                  </Typography>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <Typography variant="body2">{feature}</Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Specifications
                  </Typography>
                  <Grid container spacing={2}>
                    {Array.from(product.specifications.entries()).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="body2" color="text.secondary">
                          {key}:
                        </Typography>
                        <Typography variant="body2">{value}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Reviews
                  </Typography>
                  {product.reviews.map((review) => (
                    <Box key={review._id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          by {review.user.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{review.comment}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Shipping Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping & Returns
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Free shipping on orders over KES 5,000
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Secure payment with M-PESA or PayPal
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Support sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    30-day return policy
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Supplier Info */}
            {product.supplier && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Supplier Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{product.supplier.name}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.supplier.city}, {product.supplier.county}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={product.supplier.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.supplier.reviewCount} reviews)
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;