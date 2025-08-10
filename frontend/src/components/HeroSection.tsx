
import React from 'react'
import { Box, Container, Typography, Button, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { ArrowForward, Search, RequestQuote } from '@mui/icons-material'

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        py: { xs: 8, md: 12 },
        borderBottom: '1px solid #f0f0f0'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#000',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2
              }}
            >
              Premium Suppliers.
              <br />
              <Box component="span" sx={{ color: '#1D6D73' }}>
                Delivered Daily.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#666',
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '500px'
              }}
            >
              Connect with verified suppliers across Kenya. Get quality products, 
              competitive prices, and reliable delivery for your business needs.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: '#1D6D73',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#155a5f'
                  }
                }}
              >
                Browse Products
              </Button>

              <Button
                component={Link}
                to="/request-quote"
                variant="outlined"
                size="large"
                startIcon={<RequestQuote />}
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
                Request Quote
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: { xs: 300, md: 400 },
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef'
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#6c757d', textAlign: 'center' }}
              >
                Hero Image/Video
                <br />
                (Supply Chain Visual)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HeroSection
