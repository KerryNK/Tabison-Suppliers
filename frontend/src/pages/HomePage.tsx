"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Search, ShoppingCart, Star, TrendingUp, LocalShipping, Security } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { productsApi, type Product } from "../api"
import { useCart } from "../context/CartContext"

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { addToCart } = useCart()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load featured products
      const featuredResponse = await productsApi.getAll({ limit: 6, sort: "rating" })
      if (featuredResponse.success && featuredResponse.data) {
        setFeaturedProducts(featuredResponse.data.products || [])
      }

      // Load recent products
      const recentResponse = await productsApi.getAll({ limit: 8, sort: "createdAt" })
      if (recentResponse.success && recentResponse.data) {
        setProducts(recentResponse.data.products || [])
      }
    } catch (err) {
      setError("Failed to load products. Please try again later.")
      console.error("Error loading initial data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1)
      // You could add a toast notification here
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const categories = [
    { name: "Shoes", icon: "👟", color: "#FF6B6B" },
    { name: "Tech", icon: "💻", color: "#4ECDC4" },
    { name: "Gear", icon: "🎒", color: "#45B7D1" },
    { name: "Safety", icon: "🦺", color: "#FFA726" },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 6,
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Welcome to Tabison Suppliers
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Your trusted partner for military, safety, and official footwear products
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
                  Search
                </Button>
              ),
              sx: {
                bgcolor: "white",
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="body2">Products</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                50+
              </Typography>
              <Typography variant="body2">Suppliers</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                1000+
              </Typography>
              <Typography variant="body2">Happy Customers</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                24/7
              </Typography>
              <Typography variant="body2">Support</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          Shop by Category
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={6} md={3} key={category.name}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => navigate(`/products?category=${category.name}`)}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Featured Products
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/products")} endIcon={<TrendingUp />}>
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images?.[0] || "/placeholder.svg?height=200&width=300"}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description?.substring(0, 100)}...
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Star sx={{ color: "#FFD700", fontSize: 20 }} />
                    <Typography variant="body2">
                      {product.rating?.toFixed(1) || "0.0"} ({product.reviews?.length || 0} reviews)
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${product.price?.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Products */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Latest Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={product.images?.[0] || "/placeholder.svg?height=150&width=200"}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price?.toFixed(2)}
                  </Typography>
                  {product.tags && (
                    <Box mt={1}>
                      <Chip label={product.tags[0]} size="small" color="primary" variant="outlined" />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          bgcolor: "grey.50",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 6,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          Why Choose Tabison Suppliers?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <LocalShipping sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Fast & Reliable Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quick delivery with real-time tracking for all your orders.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Security sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Secure Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your payments are protected with enterprise-grade security.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Star sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quality Guaranteed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Premium quality products from trusted suppliers worldwide.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Join thousands of satisfied customers and experience the future of logistics.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: "white", color: "primary.main" }}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderColor: "white", color: "white" }}
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default HomePage
