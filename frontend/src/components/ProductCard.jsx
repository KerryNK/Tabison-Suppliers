import React, { useState } from "react";
import { motion, useAnimation } from 'framer-motion';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Collapse, IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
};

const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => getFavorites().includes(product._id));
  const cartAnim = useAnimation();

  const handleAddToCart = () => {
    if (typeof onAddToCart === 'function') onAddToCart(product);
    cartAnim.start({ scale: [1, 1.15, 0.95, 1], transition: { duration: 0.4 } });
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favs = getFavorites();
    if (isFavorite) {
      favs = favs.filter(id => id !== product._id);
    } else {
      favs.push(product._id);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', p: 0 }}>
      {/* Wishlist Heart Icon */}
      <Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
        <IconButton
          onClick={toggleFavorite}
          sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3, bgcolor: '#fff', boxShadow: 1 }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="action" />}
        </IconButton>
      </Tooltip>
      {product.tags && product.tags.includes('New') && (
        <Chip label="New" color="primary" size="small" sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, fontWeight: 700 }} />
      )}
      {product.tags && product.tags.includes('Best Seller') && (
        <Chip label="Best Seller" color="secondary" size="small" sx={{ position: 'absolute', top: 12, right: 48, zIndex: 2, fontWeight: 700 }} />
      )}
      {product.images && product.images[0] ? (
        <CardMedia component="img" image={product.images[0]} alt={product.name} sx={{ height: 180, objectFit: 'cover', bgcolor: '#f9f9f9' }} />
      ) : (
        <Box sx={{ height: 180, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">No Image</Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', textAlign: 'center', width: '100%' }}>{product.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{product.type}</Typography>
        <Typography variant="body1" sx={{ color: 'secondary.main', mb: 2, fontWeight: 600 }}>Ksh {product.retailPrice}</Typography>
        {product.features && product.features.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 8 }}>
            {product.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        )}
        <Button size="small" color="primary" onClick={() => setShowBreakdown(v => !v)} sx={{ mb: 1 }}>
          {showBreakdown ? 'Hide' : 'Show'} Cost Breakdown
        </Button>
        <Collapse in={showBreakdown} sx={{ width: '100%' }}>
          {product.costBreakdown && (
            <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 2, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cost Breakdown:</Typography>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {Object.entries(product.costBreakdown).map(([k, v]) => (
                  <li key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                    <span style={{ fontFamily: 'monospace' }}>{v}</span>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Collapse>
        <motion.div animate={cartAnim} style={{ width: '100%' }}>
          <Button variant="contained" color="secondary" sx={{ mt: 'auto', fontWeight: 700, width: '100%' }} onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </motion.div>
        <Button size="small" color="info" sx={{ mt: 1, width: '100%' }} onClick={() => onQuickView(product)}>
          Quick View
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
