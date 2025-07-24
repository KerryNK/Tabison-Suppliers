import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/HeroSection';
import FeaturedSuppliers from '../components/FeaturedSuppliers';

const HomePage: React.FC = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturedSuppliers />
    </Box>
  );
};

export default HomePage;