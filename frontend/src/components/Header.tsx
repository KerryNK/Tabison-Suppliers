import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
  Container,
  Avatar
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brightness4, 
  Brightness7, 
  Menu as MenuIcon,
  AccountCircle,
  Business,
  Inventory,
  ShoppingCart,
  Info,
  ContactSupport
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header: React.FC = () => {
  const { mode, toggle } = useThemeMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Business /> },
    { label: 'Suppliers', path: '/suppliers', icon: <Business /> },
    { label: 'Products', path: '/products', icon: <Inventory /> },
    { label: 'About', path: '/about', icon: <Info /> },
    { label: 'Contact', path: '/contact', icon: <ContactSupport /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            {/* Logo and Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Avatar 
                  src={logo} 
                  alt="Tabison Suppliers" 
                  sx={{ width: 40, height: 40, mr: 1.5 }}
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'primary.main',
                    fontSize: '1.4rem',
                    letterSpacing: '-0.5px'
                  }}
                >
                  Tabison
                  <Box component="span" sx={{ color: '#4fd1c5', ml: 0.5 }}>
                    Suppliers
                  </Box>
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'rgba(79, 209, 197, 0.1)',
                      color: 'primary.main'
                    },
                    '&::after': isActive(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '2px',
                      bgcolor: 'primary.main',
                      borderRadius: '2px'
                    } : {}
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Cart Icon */}
              <IconButton 
                component={Link} 
                to="/cart" 
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <ShoppingCart />
              </IconButton>

              {/* Theme Toggle */}
              <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton 
                  onClick={toggle} 
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              {user ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ 
                      color: 'text.primary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <Typography>Welcome, {user.name}!</Typography>
                    </MenuItem>
                    <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                  <Button 
                    component={Link} 
                    to="/login" 
                    variant="outlined"
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="contained"
                    size="small"
                    sx={{ 
                      bgcolor: '#4fd1c5',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#38b2ac'
                      }
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}

              {/* Mobile Menu */}
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMenuClose}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    component={Link} 
                    to={item.path} 
                    onClick={handleMenuClose}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 600 : 400
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      {item.label}
                    </Box>
                  </MenuItem>
                ))}
                {!user && (
                  <>
                    <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                      Login
                    </MenuItem>
                    <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
