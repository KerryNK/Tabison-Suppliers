import type React from "react"
import { Box, Typography, Link as MuiLink, IconButton, Stack, Container, Grid, Avatar } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn, Business } from "@mui/icons-material"
import { Link } from "react-router-dom"
// import logo from '../assets/logo.jpg'; // Temporarily commented out

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        py: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ width: 50, height: 50, mr: 2, bgcolor: "#4fd1c5", color: "#1a202c", fontWeight: 800 }}>
                TS
              </Avatar>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#4fd1c5",
                }}
              >
                Tabison Suppliers
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: "#a0aec0",
                lineHeight: 1.6,
              }}
            >
              Leading supplier of military, safety, and professional footwear in Kenya. Quality products for military,
              police, and industrial use.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                color="inherit"
                href="https://facebook.com/tabisonsuppliers"
                target="_blank"
                rel="noopener"
                sx={{
                  bgcolor: "rgba(79, 209, 197, 0.1)",
                  "&:hover": { bgcolor: "#4fd1c5", color: "#1a202c" },
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
                  bgcolor: "rgba(79, 209, 197, 0.1)",
                  "&:hover": { bgcolor: "#4fd1c5", color: "#1a202c" },
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
                  bgcolor: "rgba(79, 209, 197, 0.1)",
                  "&:hover": { bgcolor: "#4fd1c5", color: "#1a202c" },
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
                  bgcolor: "rgba(79, 209, 197, 0.1)",
                  "&:hover": { bgcolor: "#4fd1c5", color: "#1a202c" },
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
                color: "#4fd1c5",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
                }}
              >
                About Us
              </MuiLink>
              <MuiLink
                component={Link}
                to="/contact"
                color="inherit"
                underline="hover"
                sx={{
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
                }}
              >
                Contact
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
                color: "#4fd1c5",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                  color: "#a0aec0",
                  "&:hover": { color: "#4fd1c5" },
                  transition: "color 0.3s ease",
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
                color: "#4fd1c5",
              }}
            >
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOn sx={{ color: "#4fd1c5" }} />
                <Typography variant="body2" sx={{ color: "#a0aec0" }}>
                  Industrial Area, Nairobi, Kenya
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Phone sx={{ color: "#4fd1c5" }} />
                <Typography variant="body2" sx={{ color: "#a0aec0" }}>
                  +254-700-123456
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Email sx={{ color: "#4fd1c5" }} />
                <Typography variant="body2" sx={{ color: "#a0aec0" }}>
                  info@tabisonsuppliers.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Business sx={{ color: "#4fd1c5" }} />
                <Typography variant="body2" sx={{ color: "#a0aec0" }}>
                  Mon - Fri: 8:00 AM - 6:00 PM
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.2)", mt: 3, pt: 3, textAlign: "center" }}>
          <Typography variant="body2">© {currentYear} Tabison Suppliers. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
