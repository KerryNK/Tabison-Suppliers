import React from "react";
import { Box, Typography, Grid, Button, CircularProgress, Alert } from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const FavoritesPage: React.FC = () => {
  const { items, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (productId: string) => {
    const product = items.find(p => p._id === productId);
    if (product) {
      await addToCart(product, 1);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>
        <Favorite sx={{ mr: 1, verticalAlign: 'middle' }} />
        My Wishlist
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start adding products you love!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/products')} size="large">
            Browse Products
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
          </Typography>
          <Grid container spacing={3}>
            {items.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  onQuickView={() => navigate(`/products/${product._id}`)}
                  onAddToCart={() => handleAddToCart(product._id)}
                  onRemoveFromWishlist={() => handleRemoveFromWishlist(product._id)}
                  showRemoveFromWishlist={true}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default FavoritesPage;
