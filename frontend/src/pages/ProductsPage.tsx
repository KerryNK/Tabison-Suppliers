import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Snackbar, Alert } from "@mui/material";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from '../context/CartContext';

const ProductsPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get("/products").then(data => { setProducts(data); setLoading(false); }).catch(() => { setError("Failed to fetch products"); setLoading(false); });
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setSuccess(`${product.name} added to cart!`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
              {product.images && product.images[0] ? (
                <CardMedia component="img" image={product.images[0]} alt={product.name} sx={{ height: 180, objectFit: 'contain', bgcolor: '#f9f9f9' }} />
              ) : (
                <Box sx={{ height: 180, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No Image</Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', textAlign: 'center' }}>{product.name}</Typography>
                <Typography variant="body1" sx={{ color: 'secondary.main', mb: 2, fontWeight: 600 }}>Ksh {product.retailPrice}</Typography>
                <Button variant="contained" color="secondary" onClick={() => handleAddToCart(product)} sx={{ mt: 'auto', fontWeight: 700 }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={() => { setError(""); setSuccess(""); }}>
        {error ? <Alert severity="error">{error}</Alert> : success ? <Alert severity="success">{success}</Alert> : null}
      </Snackbar>
    </Box>
  );
};

export default ProductsPage; 