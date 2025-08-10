
import React, { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Chip
} from "@mui/material"
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder, 
  Visibility 
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import Counter from "./Counter"

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    console.log("Added to cart:", { product: product._id, quantity })
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: '1px solid #e9ecef',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          '& .product-image': {
            transform: 'scale(1.05)'
          }
        }
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images?.[0] || "/api/placeholder/300/200"}
          alt={product.name}
          className="product-image"
          sx={{
            objectFit: "cover",
            transition: 'transform 0.3s ease-in-out'
          }}
        />
        
        {/* Stock Status */}
        {!product.inStock && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#ff4444',
              color: '#fff',
              fontWeight: 600
            }}
          />
        )}

        {/* Favorite Button */}
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: '#fff'
            }
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: '#ff4444' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Category */}
        {product.category && (
          <Typography
            variant="caption"
            sx={{
              color: '#1D6D73',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              mb: 1,
              display: 'block'
            }}
          >
            {product.category}
          </Typography>
        )}

        {/* Product Name */}
        <Typography
          variant="h6"
          component={Link}
          to={`/products/${product._id}`}
          sx={{
            fontWeight: 600,
            color: '#000',
            textDecoration: 'none',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            '&:hover': {
              color: '#1D6D73'
            }
          }}
        >
          {product.name}
        </Typography>

        {/* Description */}
        {product.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Price */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1D6D73',
            mb: 2
          }}
        >
          {formatPrice(product.retailPrice)}
        </Typography>

        {/* Quantity Counter */}
        {product.inStock && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Qty:
            </Typography>
            <Counter
              initialValue={quantity}
              min={1}
              max={product.stockQuantity || 10}
              onChange={setQuantity}
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            sx={{
              flexGrow: 1,
              backgroundColor: "#1D6D73",
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              borderRadius: 1.5,
              "&:hover": { 
                backgroundColor: "#155a5f" 
              },
              "&:disabled": {
                backgroundColor: '#ccc',
                color: '#999'
              }
            }}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          <IconButton
            component={Link}
            to={`/products/${product._id}`}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1.5,
              '&:hover': {
                borderColor: '#1D6D73',
                backgroundColor: 'rgba(29, 109, 115, 0.05)'
              }
            }}
          >
            <Visibility />
          </IconButton>
        </Box>

        {/* Stock Info */}
        {product.inStock && product.stockQuantity && (
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              mt: 2,
              textAlign: 'center',
              display: 'block'
            }}
          >
            {product.stockQuantity} items available
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductCard
