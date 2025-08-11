import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "teal",
        color: "white",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              TABISON SUPPLIERS
            </Typography>
            <Typography variant="body2">
              Your trusted partner for supplies and logistics solutions.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" component="a" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/products" component="a" color="inherit" underline="hover">
                Products
              </Link>
              <Link href="/suppliers" component="a" color="inherit" underline="hover">
                Suppliers
              </Link>
              <Link href="/about" component="a" color="inherit" underline="hover">
                About
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/products?category=Shoes" component="a" color="inherit" underline="hover">
                Boots and Footwear
              </Link>
              <Link href="/products?category=Gears" component="a" color="inherit" underline="hover">
                Safety Gears
              </Link>
              <Link href="/products?category=Tech" component="a" color="inherit" underline="hover">
                Electronics and Accessories
              </Link>
              <Link href="/products?category=Clothing" component="a" color="inherit" underline="hover">
                Hoodies and Clothing
                </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                aria-label="Facebook"
                component="a"
                href="https://www.facebook.com/YourPage"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 1, '&:hover': { color: 'primary.light' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Twitter"
                component="a"
                href="https://twitter.com/YourProfile"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 1, '&:hover': { color: 'primary.light' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                component="a"
                href="https://instagram.com/YourProfile"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 1, '&:hover': { color: 'primary.light' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com/company/YourCompany"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ '&:hover': { color: 'primary.light' } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            mt: 4,
            pt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Tabison Suppliers. All rights reserved. ·{" "}
            <Link href="/sitemap.xml" color="inherit" underline="hover">
              Sitemap
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
