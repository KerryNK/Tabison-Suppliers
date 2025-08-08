import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, CircularProgress, Alert } from '@mui/material';
import { useApi } from '../api/client';
import { useCart } from '../context/CartContext';
import BulkQuoteForm from '../components/BulkQuoteForm';
import SEO from '../components/SEO';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const api = useApi();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const p = await api.get(`/products/${id}`);
        setProduct(p);
      } catch {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [api, id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="info">Product not found</Alert>;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 2, mt: 3 }}>
      <SEO title={`${product.name} | Tabison Suppliers`} description={product.description} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1 }}>{product.description}</Typography>
          <Typography sx={{ mt: 2, fontWeight: 700 }}>Price: Ksh {product?.pricing?.retail ?? product.price}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => addToCart(product, 1)}>Add to Cart</Button>
            <Button variant="outlined" onClick={() => {
              const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
              if (!favs.includes(product._id)) localStorage.setItem('favorites', JSON.stringify([...favs, product._id]));
            }}>Add to Wishlist</Button>
          </Stack>
          <BulkQuoteForm defaultProductId={product._id} />
        </Box>
      </Stack>
    </Box>
  );
};

export default ProductDetailPage;


