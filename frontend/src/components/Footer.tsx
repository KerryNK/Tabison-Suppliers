import type React from "react"
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material"

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.dark",
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
              Leading supplier of military boots, safety footwear, and professional equipment in Kenya.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover">
                Products
              </Link>
              <Link href="/suppliers" color="inherit" underline="hover">
                Suppliers
              </Link>
              <Link href="/about" color="inherit" underline="hover">
                About
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/products?category=military" color="inherit" underline="hover">
                Military Boots
              </Link>
              <Link href="/products?category=safety" color="inherit" underline="hover">
                Safety Footwear
              </Link>
              <Link href="/products?category=official" color="inherit" underline="hover">
                Official Footwear
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
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
          <Typography variant="body2">© {new Date().getFullYear()} Tabison Suppliers. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
