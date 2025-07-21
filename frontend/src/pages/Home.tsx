import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home: React.FC = () => (
  <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9f9f9', pt: 8 }}>
    <img src={logo} alt="Tabison Suppliers Logo" style={{ maxWidth: 220, width: '60vw', marginBottom: 24 }} />
    <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1, textAlign: 'center' }}>
      TABISON SUPPLIERS
    </Typography>
    <Typography variant="h5" sx={{ color: 'secondary.main', mb: 2, textAlign: 'center' }}>
      Delivering Tomorrow, Today
    </Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
      <Button component={Link} to="/products" variant="contained" color="primary" size="large">
        Shop Now
      </Button>
      <Button component={Link} to="/contact" variant="outlined" color="secondary" size="large">
        Contact Us
      </Button>
    </Stack>
  </Box>
);

export default Home; 