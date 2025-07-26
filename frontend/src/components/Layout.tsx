import React from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <Toolbar /> {/* Spacer for fixed header */}
      <Box sx={{ minHeight: "calc(100vh - 64px)" }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;