import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Avatar, Box, Button } from "@mui/material";
import logo from '../assets/logo.png';

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Suppliers", path: "/suppliers" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/orders" },
  { label: "Cart", path: "/cart" },
];

const drawerWidth = 220;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "secondary.main",
            color: "#fff",
            p: 0,
          },
        }}
      >
        <Toolbar sx={{ bgcolor: "secondary.main", minHeight: 64, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={logo} alt="Tabison Suppliers Logo" style={{ height: 48, marginRight: 12 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
              Tabison Suppliers
            </Typography>
          </Link>
        </Toolbar>
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                color: location.pathname.startsWith(item.path) ? "primary.main" : "#fff",
                fontWeight: location.pathname.startsWith(item.path) ? 700 : 400,
                pl: 3,
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2, borderTop: "1px solid #26304a" }}>
          {user ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "primary.main" }}>{user.username[0]?.toUpperCase()}</Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: "#b2b2b2" }}>
                  {user.role}
                </Typography>
              </Box>
              <Button onClick={logout} color="primary" variant="outlined" size="small" sx={{ ml: 1, color: "primary.main", borderColor: "primary.main" }}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button component={Link} to="/login" color="primary" variant="contained" size="small" sx={{ mr: 1 }}>
                Login
              </Button>
              <Button component={Link} to="/register" color="primary" variant="outlined" size="small">
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
      <Box sx={{ flex: 1, ml: `${drawerWidth}px` }}>
        <AppBar position="fixed" sx={{ ml: `${drawerWidth}px`, bgcolor: "background.paper", color: "secondary.main", boxShadow: 0, borderBottom: 1, borderColor: "divider" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {navItems.find((item) => location.pathname.startsWith(item.path))?.label || ""}
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout; 