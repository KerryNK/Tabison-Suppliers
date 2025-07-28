"use client"

import type React from "react"
import { useState } from "react"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Badge, Container } from "@mui/material"
import { Menu as MenuIcon, ShoppingCart, Person } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Suppliers", path: "/suppliers" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ]

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "primary.main" }}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            Tabison Suppliers
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button key={item.path} component={Link} to={item.path} color="inherit" sx={{ textTransform: "none" }}>
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Cart and User Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={0} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/login">
              <Person />
            </IconButton>

            {/* Mobile Menu */}
            <IconButton color="inherit" sx={{ display: { xs: "block", md: "none" } }} onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu Dropdown */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  handleMenuClose()
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
