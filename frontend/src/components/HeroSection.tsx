import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Business, Search, Verified, TrendingUp } from '@mui/icons-material';

const HeroSection: React.FC = () => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      py: 8,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
      }} />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2
              }}
            >
              Your Bridge to
              <Box component="span" sx={{ color: '#4fd1c5', display: 'block' }}>
                Reliable Suppliers
              </Box>
              in Kenya
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontSize: '1.25rem',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Connect with verified suppliers for military, safety, and official footwear. 
              Streamline your procurement process with trusted partners.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: '#4fd1c5',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#38b2ac',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(79, 209, 197, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Register as Supplier
              </Button>
              
              <Button 
                component={Link}
                to="/suppliers"
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#4fd1c5',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Browse Suppliers
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Supply Chain Management"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}
              />
            </Box>
          </Grid>
        </Grid>
        
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mt: 6 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Business sx={{ fontSize: 40, color: '#4fd1c5', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>150+</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Verified Suppliers</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Verified sx={{ fontSize: 40, color: '#4fd1c5', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>99%</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Quality Assurance</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Search sx={{ fontSize: 40, color: '#4fd1c5', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>24/7</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Support Available</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#4fd1c5', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>500+</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Successful Orders</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
