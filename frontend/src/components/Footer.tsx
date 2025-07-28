import React from 'react';
import { 
  Box, 
  Typography, 
  Link as MuiLink, 
  IconButton, 
  Stack, 
  Container,
  Grid,
  Divider,
  Avatar
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Business
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
// import logo from '../assets/logo.jpg'; // Temporarily commented out

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box sx={{ 
      bgcolor: '#1a202c', 
      color: '#fff', 
      pt: 8, 
      pb: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #4fd1c5 100%)'
      }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 50, height: 50, mr: 2, bgcolor: '#4fd1c5', color: '#1a202c', fontWeight: 800 }}
              >
                TS
              </Avatar>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  color: '#4fd1c5'
                }}
              >
                Tabison Suppliers
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: '#a0aec0',
                lineHeight: 1.6
              }}
            >
              Your trusted bridge to reliable suppliers in Kenya. 
              Connecting businesses with verified partners for military, 
              safety, and official footwear solutions.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                color="inherit" 
                href="https://facebook.com/tabisonsuppliers" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  bgcolor: 'rgba(79, 209, 197, 0.1)',
                  '&:hover': { bgcolor: '#4fd1c5', color: '#1a202c' }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://twitter.com/tabisonsuppliers" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  bgcolor: 'rgba(79, 209, 197, 0.1)',
                  '&:hover': { bgcolor: '#4fd1c5', color: '#1a202c' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://instagram.com/tabisonsuppliers" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  bgcolor: 'rgba(79, 209, 197, 0.1)',
                  '&:hover': { bgcolor: '#4fd1c5', color: '#1a202c' }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://linkedin.com/company/tabisonsuppliers" 
                target="_blank" 
                rel="noopener"
                sx={{ 
                  bgcolor: 'rgba(79, 209, 197, 0.1)',
                  '&:hover': { bgcolor: '#4fd1c5', color: '#1a202c' }
                }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: '#4fd1c5'
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={2}>
              <MuiLink 
                component={Link} 
                to="/" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                Home
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/suppliers" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                Suppliers
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/products" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                Products
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/about" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                About Us
              </MuiLink>
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: '#4fd1c5'
              }}
            >
              Services
            </Typography>
            <Stack spacing={2}>
              <MuiLink 
                component={Link} 
                to="/register" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                Supplier Registration
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/orders" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                Order Management
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/testimonials" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                Testimonials
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/faq" 
                color="inherit" 
                underline="hover" 
                sx={{ 
                  color: '#a0aec0',
                  '&:hover': { color: '#4fd1c5' },
                  transition: 'color 0.3s ease'
                }}
              >
                FAQ
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: '#4fd1c5'
              }}
            >
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ color: '#4fd1c5' }} />
                <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                  Nairobi, Kenya
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: '#4fd1c5' }} />
                <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                  +254 700 000 000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#4fd1c5' }} />
                <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                  info@tabisonsuppliers.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Business sx={{ color: '#4fd1c5' }} />
                <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                  Mon - Fri: 8:00 AM - 6:00 PM
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#2d3748' }} />
        
        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 2
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#718096',
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {currentYear} Tabison Suppliers. All rights reserved.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            alignItems="center"
          >
            <MuiLink 
              component={Link} 
              to="/privacy" 
              color="inherit" 
              underline="hover" 
              sx={{ 
                color: '#718096',
                fontSize: '0.875rem',
                '&:hover': { color: '#4fd1c5' }
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink 
              component={Link} 
              to="/terms" 
              color="inherit" 
              underline="hover" 
              sx={{ 
                color: '#718096',
                fontSize: '0.875rem',
                '&:hover': { color: '#4fd1c5' }
              }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink 
              href="/contact" 
              color="inherit" 
              underline="hover" 
              sx={{ 
                color: '#718096',
                fontSize: '0.875rem',
                '&:hover': { color: '#4fd1c5' }
              }}
            >
              Support
            </MuiLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
