import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const HeroSection: React.FC = () => (
  <Box
    sx={{
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      py: { xs: 8, md: 12 },
      textAlign: 'center',
    }}
  >
    <Container maxWidth="md">
      <PeopleAltIcon sx={{ fontSize: 60, mb: 2, color: 'secondary.main' }} />
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
        }}
      >
        Find Your Perfect Supplier
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          fontSize: { xs: '1.1rem', md: '1.25rem' },
        }}
      >
        Verified suppliers for growing businesses in Kenya.
      </Typography>
    </Container>
  </Box>
);

export default HeroSection;