import type React from "react"
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

const HomePage: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Military Boots (Long)",
      price: "KSh 2,000",
      image: "/placeholder.svg?height=200&width=300",
      description: "22cm Height, 8 Inches, PVC Material",
    },
    {
      id: 2,
      name: "Safety Boots",
      price: "KSh 2,500",
      image: "/placeholder.svg?height=200&width=300",
      description: "Industrial grade safety footwear",
    },
    {
      id: 3,
      name: "Official Men Permanent Shine",
      price: "KSh 2,000",
      image: "/placeholder.svg?height=200&width=300",
      description: "Professional formal footwear",
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Quality Footwear for Professionals
          </Typography>
          <Typography variant="h5" gutterBottom>
            Military, Safety & Official Boots - Made in Kenya
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Trusted supplier of high-quality boots for military, police, security, and industrial professionals across
            Kenya.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/products"
              sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
            >
              Shop Products
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/suppliers"
              sx={{ borderColor: "white", color: "white", "&:hover": { borderColor: "grey.300" } }}
            >
              Find Suppliers
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Featured Products
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Discover our most popular military, safety, and professional footwear
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia component="img" height="200" image={product.image} alt={product.name} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ mt: 2 }}>
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button variant="contained" size="large" component={RouterLink} to="/products">
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Why Choose Us */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Why Choose Tabison Suppliers?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  Quality Assured
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  All our products meet international quality standards and are built to last in demanding conditions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  Local Manufacturing
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Proudly made in Kenya, supporting local industry and providing jobs to our communities.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  Competitive Pricing
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Direct from manufacturer pricing with wholesale and retail options available.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Contact us today for bulk orders, custom requirements, or to become a supplier partner.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/contact"
            sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
          >
            Contact Us
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
