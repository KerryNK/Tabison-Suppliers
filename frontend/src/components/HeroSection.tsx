import React from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Container } from '@mui/material';
import { Search, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        pt: { xs: 12, md: 16 },
        pb: { xs: 12, md: 16 },
        textAlign: 'center',
        color: 'white',
        background: 'linear-gradient(45deg, #2d3748 30%, #4a5568 90%)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            letterSpacing: '-1px',
          }}
        >
          Find Verified Suppliers for Your Business
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 4,
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '700px',
            mx: 'auto',
          }}
        >
          Connect with trusted partners for military, safety, and official footwear.
          Streamline your procurement process with Tabison Suppliers.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            component={RouterLink}
            to="/suppliers"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: '#4fd1c5',
              color: '#1a202c',
              fontWeight: 600,
              py: 1.5,
              px: 4,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#38b2ac',
              },
            }}
          >
            Browse Suppliers
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;