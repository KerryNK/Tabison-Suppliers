"use client"

import type React from "react"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Menu as MenuIcon, ShoppingCart, Person } from "@mui/icons-material"
import { Link as RouterLink, useNavigate } from "react-router-dom"

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
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
    <AppBar position="sticky" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          TABISON SUPPLIERS
        </Typography>

        {isMobile ? (
          <>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
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
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {menuItems.map((item) => (
              <Button key={item.path} color="inherit" component={RouterLink} to={item.path}>
                {item.label}
              </Button>
            ))}

            <IconButton color="inherit" component={RouterLink} to="/cart">
              <ShoppingCart />
            </IconButton>

            <Button color="inherit" startIcon={<Person />} component={RouterLink} to="/login">
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
