import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // Example Icon

const Navbar = () => {
  return (
    <AppBar 
      position="sticky" 
      color="background" 
      elevation={1}
      sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="primary" aria-label="logo">
            {/* Replace with your actual logo */}
            <BusinessCenterIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Tabison Suppliers
          </Typography>
        </Box>
        
        <Box>
          <Button color="inherit" sx={{ color: 'text.secondary' }}>Browse Suppliers</Button>
          <Button color="inherit" sx={{ color: 'text.secondary' }}>About Us</Button>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ ml: 2 }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;