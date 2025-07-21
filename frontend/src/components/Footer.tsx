import React from 'react';
import { Box, Typography, Link as MuiLink, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 4, mt: 8 }}>
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
        <MuiLink component={Link} to="/about" color="inherit" underline="hover" sx={{ fontWeight: 600 }}>About</MuiLink>
        <MuiLink component={Link} to="/contact" color="inherit" underline="hover" sx={{ fontWeight: 600 }}>Contact</MuiLink>
        <MuiLink component={Link} to="/privacy" color="inherit" underline="hover" sx={{ fontWeight: 600 }}>Privacy</MuiLink>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton color="inherit" href="https://facebook.com" target="_blank" rel="noopener"><FacebookIcon /></IconButton>
        <IconButton color="inherit" href="https://twitter.com" target="_blank" rel="noopener"><TwitterIcon /></IconButton>
        <IconButton color="inherit" href="https://instagram.com" target="_blank" rel="noopener"><InstagramIcon /></IconButton>
        <IconButton color="inherit" href="https://linkedin.com" target="_blank" rel="noopener"><LinkedInIcon /></IconButton>
      </Stack>
    </Box>
    <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#b2b2b2' }}>
      © {new Date().getFullYear()} Tabison Suppliers. All rights reserved.
    </Typography>
  </Box>
);

export default Footer; 