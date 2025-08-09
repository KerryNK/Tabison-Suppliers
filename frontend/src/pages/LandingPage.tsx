"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Fade,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { ShoppingCart, Close, LocalShipping, Security, Speed } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const LandingPage: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`)
  }

  const handleContactClick = () => {
    navigate("/contact")
  }

  const handleCartClick = () => {
    navigate("/cart")
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src="/frontend/src/assets/logo.jpg"
              alt="Tabison Suppliers"
              sx={{
                height: 50,
                width: 50,
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#2c5aa0",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                TABISON SUPPLIERS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#666",
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                }}
              >
                Delivering Tomorrow Today
              </Typography>
            </Box>
          </Box>

          {/* Center Text */}
          {!isMobile && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                flex: 1,
              }}
            >
              Delivering Tomorrow Today.
            </Typography>
          )}

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              onClick={handleContactClick}
              sx={{
                color: "#333",
                fontWeight: "medium",
                textTransform: "none",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Contacts
            </Button>
            <IconButton
              onClick={handleCartClick}
              sx={{
                bgcolor: "#2c5aa0",
                color: "white",
                "&:hover": {
                  bgcolor: "#1e3d6f",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ShoppingCart />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hardware Acceleration Notification */}
      {showNotification && (
        <Fade in={showNotification}>
          <Alert
            severity="info"
            action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => setShowNotification(false)}>
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{
              bgcolor: "rgba(0,0,0,0.8)",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }}
          >
            Improve performance by enabling hardware acceleration{" "}
            <Button size="small" sx={{ color: "white", textDecoration: "underline" }}>
              Learn more
            </Button>
          </Alert>
        </Fade>
      )}

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "70vh", md: "80vh" },
          backgroundImage:
            "url(/placeholder.svg?height=800&width=1200&query=modern+warehouse+logistics+facility+with+robotic+arm)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  mb: 4,
                  lineHeight: 1.1,
                  letterSpacing: "2px",
                }}
              >
                WELCOME TO THE
                <br />
                FUTURE OF LOGISTICS
              </Typography>

              {/* Category Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, md: 3 },
                  justifyContent: "center",
                  flexWrap: "wrap",
                  mt: 4,
                }}
              >
                {["Shoes", "Tech", "Gear"].map((category) => (
                  <Button
                    key={category}
                    variant="contained"
                    onClick={() => handleCategoryClick(category)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "#333",
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.5, md: 2 },
                      borderRadius: "50px",
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      fontWeight: "bold",
                      textTransform: "none",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,255,255,0.3)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        bgcolor: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <LocalShipping sx={{ fontSize: 60, color: "#2c5aa0", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Fast Delivery
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quick and reliable delivery to your doorstep with real-time tracking.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Security sx={{ fontSize: 60, color: "#2c5aa0", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Secure Payments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your transactions are protected with enterprise-grade security.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Speed sx={{ fontSize: 60, color: "#2c5aa0", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Quality Products
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Premium quality products from trusted suppliers worldwide.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "rgba(240,240,240,0.8)",
          py: 3,
          mt: 8,
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button onClick={() => navigate("/terms")} sx={{ color: "#333", textTransform: "none" }}>
              Terms
            </Button>
            <Button onClick={handleContactClick} sx={{ color: "#333", textTransform: "none" }}>
              Contact
            </Button>
            <Button
              onClick={() => window.open("https://facebook.com", "_blank")}
              sx={{ color: "#333", textTransform: "none" }}
            >
              Facebook
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            © 2024 Tabison Suppliers. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
