
import React from 'react'
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import { 
  LocalShipping, 
  VerifiedUser, 
  Support, 
  TrendingUp,
  ArrowForward 
} from '@mui/icons-material'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: '#1D6D73' }} />,
      title: 'Verified Suppliers',
      description: 'All suppliers are thoroughly vetted and verified for quality and reliability.'
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#1D6D73' }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across Kenya with real-time tracking.'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#1D6D73' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help with all your needs.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1D6D73' }} />,
      title: 'Competitive Prices',
      description: 'Best market prices with bulk discount options available.'
    }
  ]

  const categories = [
    { name: 'Electronics', count: '250+ Products', image: '/api/placeholder/300/200' },
    { name: 'Construction', count: '180+ Products', image: '/api/placeholder/300/200' },
    { name: 'Agriculture', count: '120+ Products', image: '/api/placeholder/300/200' }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Why Choose Tabison */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#000',
              mb: 2
            }}
          >
            Why Choose Tabison?
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: '#666',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            We connect businesses with trusted suppliers, ensuring quality, 
            reliability, and competitive pricing.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    backgroundColor: '#fff',
                    border: '1px solid #e9ecef',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600, mb: 2, color: '#000' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Product Categories */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#000',
              mb: 6
            }}
          >
            Shop by Category
          </Typography>

          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  component={Link}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  elevation={0}
                  sx={{
                    textDecoration: 'none',
                    border: '1px solid #e9ecef',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#6c757d' }}>
                      {category.name} Image
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600, mb: 1, color: '#000' }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666' }}
                    >
                      {category.count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderColor: '#1D6D73',
                color: '#1D6D73',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#155a5f',
                  backgroundColor: 'rgba(29, 109, 115, 0.05)'
                }
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#1D6D73' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 2
              }}
            >
              Ready to Get Started?
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              Join thousands of businesses who trust Tabison for their supply needs.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#fff',
                  color: '#1D6D73',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                Create Account
              </Button>

              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#fff',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
