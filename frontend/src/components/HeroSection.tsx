import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { ArrowForward, RequestQuote } from '@mui/icons-material'

const HERO_BG_IMAGE = '/hero-bg.jpg'
const BRAND_TEAL = '#1D6D73'

const HeroSection: React.FC = () => (
  <Box
    component="section"
    sx={{
      minHeight: '100vh',
      position: 'relative',
      backgroundImage: `url(${HERO_BG_IMAGE})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
    }}
  >
    {/* Overlay */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    />

    <Container
      maxWidth="xl"
      sx={{
        position: 'relative',
        zIndex: 1,
        py: { xs: 8, md: 20 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '100%', md: 600 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            lineHeight: 1.1,
          }}
        >
          Delivering Tomorrow,{' '}
          <Box component="span" sx={{ color: BRAND_TEAL }}>
            Today
          </Box>
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 5,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            color: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          Welcome to the future of Logistics. Partner with Tabison Suppliers
          for trusted products tailored to your business needs.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
            flexWrap: 'wrap',
          }}
        >
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: BRAND_TEAL,
              color: '#fff',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': { backgroundColor: '#155a5f' },
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
              borderColor: BRAND_TEAL,
              color: BRAND_TEAL,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                borderColor: '#155a5f',
                backgroundColor: 'rgba(29, 109, 115, 0.05)',
              },
            }}
          >
            Request Quote
          </Button>
        </Box>
      </Box>
    </Container>
  </Box>
)

export default HeroSection
