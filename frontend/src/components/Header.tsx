
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  useMediaQuery
} from '@mui/material'
import { 
  Menu as MenuIcon, 
  Person, 
  ShoppingCart, 
  Search,
  KeyboardArrowDown
} from '@mui/icons-material'

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

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

  const navigationItems = [
    { label: 'Products', path: '/products' },
    { label: 'Suppliers', path: '/suppliers' },
    { label: 'Request Quote', path: '/request-quote' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ]

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        color: '#000'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
        {/* Logo */}
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
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          TABISON
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
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 500,
                  mx: 1,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(29, 109, 115, 0.1)',
                    color: '#1D6D73'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Icon */}
          <IconButton 
            sx={{ color: '#000' }}
            onClick={() => navigate('/products')}
          >
            <Search />
          </IconButton>

          {/* Cart Icon */}
          <IconButton 
            component={Link} 
            to="/cart"
            sx={{ color: '#000' }}
          >
            <ShoppingCart />
          </IconButton>

          {/* Profile/Login */}
          {!isMobile ? (
            <>
              <Button
                onClick={handleProfileMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Account
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
            <IconButton sx={{ color: '#000' }} onClick={handleProfileMenuOpen}>
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
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {navigationItems.map((item) => (
                  <MenuItem 
                    key={item.label}
                    component={Link} 
                    to={item.path} 
                    onClick={handleMenuClose}
                  >
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
