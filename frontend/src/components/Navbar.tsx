import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, useTheme, useMediaQuery, Divider
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

const navItems = [
  { label: 'Browse Suppliers', path: '/suppliers' },
  { label: 'About Us', path: '/about' },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      color="background"
      elevation={1}
      sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
          <IconButton edge="start" color="primary" aria-label="logo">
            <BusinessCenterIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Tabison
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon sx={{ color: 'text.primary' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              MenuListProps={{ sx: { py: 1, minWidth: 180 } }}
            >
              {navItems.map((item) => (
                <MenuItem key={item.label} onClick={handleMenuClose} component={RouterLink} to={item.path}>
                  {item.label}
                </MenuItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleMenuClose} sx={{ px: 2 }}>
                <Button component={RouterLink} to="/register" variant="contained" color="primary" fullWidth>Register</Button>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            {navItems.map((item) => (
              <Button key={item.label} component={RouterLink} to={item.path} color="inherit" sx={{ color: 'text.secondary', fontWeight: 500 }}>{item.label}</Button>
            ))}
            <Button component={RouterLink} to="/register" variant="contained" color="primary" sx={{ ml: 2, fontWeight: 'bold' }}>Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;