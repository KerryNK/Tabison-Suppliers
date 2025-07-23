import React from 'react';
import Recommendations from '../components/Recommendations';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Helmet } from 'react-helmet-async';


const Home: React.FC = () => (
  <>
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9f9f9', pt: 8 }}>
      <Helmet>
        <title>Tabison Suppliers | Delivering Tomorrow, Today</title>
        <meta name="description" content="Tabison Suppliers delivers quality supplies with speed and reliability. Shop now for the best products, delivered tomorrow, today." />
        <meta property="og:title" content="Tabison Suppliers" />
        <meta property="og:description" content="Delivering Tomorrow, Today. Shop now for the best products and service." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <img src={logo} alt="Tabison Suppliers Logo" style={{ maxWidth: 220, width: '60vw', marginBottom: 24 }} loading="lazy" />
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
    <Recommendations />
  </>
);

export default Home; 