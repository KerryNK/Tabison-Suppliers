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
  Badge,
  Fade,
  useScrollTrigger,
  Slide,
  Alert,
  Snackbar,
} from "@mui/material"
import { ShoppingCart, Close } from "@mui/icons-material"
import { Link as RouterLink, useNavigate } from "react-router-dom"

// Hide on scroll component
interface Props {
  window?: () => Window
  children: React.ReactElement
}

function HideOnScroll(props: Props) {
  const { children, window } = props
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [showNotification, setShowNotification] = useState(true)

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category.toLowerCase()}`)
  }

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Hardware Acceleration Notification */}
      <Snackbar open={showNotification} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} sx={{ bottom: 24 }}>
        <Alert
          severity="info"
          onClose={() => setShowNotification(false)}
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button color="inherit" size="small" onClick={() => setShowNotification(false)}>
                Learn more
              </Button>
              <IconButton size="small" color="inherit" onClick={() => setShowNotification(false)}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: 2,
            "& .MuiAlert-icon": { color: "white" },
          }}
        >
          Improve performance by enabling hardware acceleration
        </Alert>
      </Snackbar>

      {/* Header */}
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            color: "text.primary",
            boxShadow: "none",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              {/* Logo Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src="/frontend/src/assets/logo.jpg"
                  alt="Tabison Suppliers"
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                  }}
                />
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "#1a2233",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    TABISON
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "#4fd1c5",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    SUPPLIERS
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    Delivering Tomorrow Today
                  </Typography>
                </Box>
              </Box>

              {/* Center Text */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#1a2233",
                  display: { xs: "none", md: "block" },
                  fontSize: "2rem",
                }}
              >
                Delivering Tomorrow Today.
              </Typography>

              {/* Right Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    color: "#1a2233",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Contacts
                </Button>
                <IconButton component={RouterLink} to="/cart" sx={{ color: "#1a2233" }}>
                  <Badge badgeContent={0} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            "url(/placeholder.svg?height=800&width=1200&query=modern+warehouse+logistics+facility+with+shelving+and+robotic+arm)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))",
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
                  fontWeight: 800,
                  fontSize: { xs: "3rem", md: "5rem", lg: "6rem" },
                  lineHeight: 1.1,
                  mb: 4,
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
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
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  mt: 6,
                }}
              >
                {["Shoes", "Tech", "Gear"].map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      color: "#1a2233",
                      px: 4,
                      py: 2,
                      borderRadius: "50px",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      textTransform: "none",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
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

      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          py: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
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
            <Button component={RouterLink} to="/terms" sx={{ color: "#1a2233", textTransform: "none" }}>
              Terms
            </Button>
            <Button component={RouterLink} to="/contact" sx={{ color: "#1a2233", textTransform: "none" }}>
              Contact
            </Button>
            <Button href="https://facebook.com" target="_blank" sx={{ color: "#1a2233", textTransform: "none" }}>
              Facebook
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
