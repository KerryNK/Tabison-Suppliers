import React from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: "100vh", 
      bgcolor: "background.default" 
    }}>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <Toolbar /> {/* Spacer for fixed header */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
