"use client"

import { useState } from "react"
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, IconButton } from "@mui/material"
import { ShoppingCart, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material"
import Counter from "./Counter"

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorited = false }) => {
  const [quantity, setQuantity] = useState(1)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product._id, quantity)
    }
  }

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(product._id)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images?.[0] || "/placeholder.svg?height=200&width=300"}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255,255,255,0.9)",
            "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
          }}
        >
          {isFavorited ? <Favorite sx={{ color: "#e91e63" }} /> : <FavoriteBorder />}
        </IconButton>

        {/* Product Tags */}
        {product.tags && product.tags.length > 0 && (
          <Box sx={{ position: "absolute", top: 8, left: 8 }}>
            {product.tags.slice(0, 2).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: tag === "New" ? "#4caf50" : "#ff9800",
                  color: "white",
                  fontSize: "0.75rem",
                  height: "20px",
                  mr: 0.5,
                  mb: 0.5,
                }}
              />
            ))}
          </Box>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
              Out of Stock
            </Typography>
          </Box>
        )}
      </Box>

      {/* Product Details */}
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description}
        </Typography>

        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {product.features.slice(0, 3).map((feature, index) => (
              <Typography key={index} variant="caption" display="block" color="text.secondary">
                • {feature}
              </Typography>
            ))}
          </Box>
        )}

        {/* Price */}
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
          {formatPrice(product.retailPrice)}
        </Typography>

        {/* Quantity and Add to Cart */}
        {product.inStock && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="body2">Qty:</Typography>
            <Counter initialValue={quantity} min={1} max={product.stockQuantity || 10} onChange={setQuantity} />
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            sx={{
              flexGrow: 1,
              backgroundColor: "#4fd1c5",
              "&:hover": { backgroundColor: "#38b2ac" },
            }}
          >
            Add to Cart
          </Button>

          <IconButton color="primary" sx={{ border: "1px solid #e0e0e0" }}>
            <Visibility />
          </IconButton>
        </Box>

        {/* Stock Quantity Info */}
        {product.inStock && product.stockQuantity && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
            {product.stockQuantity} items available
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductCard
