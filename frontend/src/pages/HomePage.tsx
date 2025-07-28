import type React from "react"
import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"

const HomePage: React.FC = () => {
  const features = [
    {
      title: "Military Footwear",
      description: "High-quality combat boots and military gear for professional use",
      icon: "🥾",
    },
    {
      title: "Safety Equipment",
      description: "Industrial safety boots and protective equipment for workplace safety",
      icon: "🦺",
    },
    {
      title: "Professional Gear",
      description: "Police and law enforcement equipment for professional operations",
      icon: "👮",
    },
  ]

  return (
    <>
      <Helmet>
        <title>Tabison Suppliers - Military, Safety & Professional Footwear</title>
        <meta
          name="description"
          content="Leading supplier of military boots, safety footwear, and professional equipment in Kenya. Quality products for military, police, and industrial use."
        />
      </Helmet>

      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            background: "linear-gradient(135deg, #2c5530 0%, #4a7c59 100%)",
            borderRadius: 3,
            color: "white",
            mb: 6,
          }}
        >
          <Typography variant="h2" gutterBottom>
            Welcome to Tabison Suppliers
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your trusted partner for military, safety, and professional footwear in Kenya
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{ backgroundColor: "secondary.main", color: "black" }}
            >
              View Products
            </Button>
            <Button
              component={Link}
              to="/suppliers"
              variant="outlined"
              size="large"
              sx={{ borderColor: "white", color: "white" }}
            >
              Find Suppliers
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" textAlign="center" gutterBottom>
            Our Specialties
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: "text.secondary" }}>
            We specialize in providing high-quality footwear and equipment for various professional needs
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                  <CardContent>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            backgroundColor: "background.paper",
            borderRadius: 3,
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Browse our extensive catalog of products or get in touch with our team
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button component={Link} to="/products" variant="contained" size="large">
              Browse Products
            </Button>
            <Button component={Link} to="/contact" variant="outlined" size="large">
              Contact Us
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default HomePage
