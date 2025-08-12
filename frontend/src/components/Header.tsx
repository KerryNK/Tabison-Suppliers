import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person,
  ShoppingCart,
  Search,
  KeyboardArrowDown,
} from '@mui/icons-material'

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Suppliers', path: '/suppliers' },
    { label: 'Request Quote', path: '/request-quote' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' },
  ]

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMobileMenuAnchor(null)
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', color: '#000' }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1, display: 'flex', alignItems: 'center' }}>
        {/* Logo Image */}
        <Box
          component="img"
          src="/assets/logo.jpg"
          alt="Tabison Suppliers Logo"
          aria-label="Go to homepage"
          sx={{ height: 40, width: 'auto', mr: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        {/* Logo Text */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            flexGrow: 0,
            fontWeight: 700,
            color: '#1D6D73',
            textDecoration: 'none',
            mr: 4,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          TABISON SUPPLIERS
        </Typography>
        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#1D6D73' : '#000',
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(29, 109, 115, 0.1)' : 'transparent',
                  textTransform: 'none',
                  fontWeight: 500,
                  mx: 1,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(29, 109, 115, 0.15)',
                    color: '#1D6D73',
                  },
                }}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Search">
            <IconButton
              sx={{ color: '#000' }}
              onClick={() => navigate('/products')}
              aria-label="search"
            >
              <Search />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cart">
            <IconButton component={Link} to="/cart" sx={{ color: '#000' }} aria-label="cart">
              <ShoppingCart />
            </IconButton>
          </Tooltip>

          {!isMobile ? (
            <>
              <Button
                onClick={handleProfileMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{ color: '#000', textTransform: 'none', fontWeight: 500 }}
                aria-controls={anchorEl ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                aria-label="account options"
              >
                Account
              </Button>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                keepMounted
              >
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                  Login
                </MenuItem>
                <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
                  Register
                </MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                  Dashboard
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              sx={{ color: '#000' }}
              onClick={handleProfileMenuOpen}
              aria-label="account options"
              aria-controls={anchorEl ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Person />
            </IconButton>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ color: '#000' }}
                aria-label="main menu"
                aria-controls={mobileMenuAnchor ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(mobileMenuAnchor) ? 'true' : undefined}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                keepMounted
              >
                {navigationItems.map((item) => (
                  <MenuItem key={item.label} component={Link} to={item.path} onClick={handleMenuClose}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
