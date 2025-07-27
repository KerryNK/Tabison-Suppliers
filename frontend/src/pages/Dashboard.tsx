import React from "react";
import { Box, Card, CardContent, Typography, Grid, Paper, Container, CircularProgress, Alert } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/client";
import HeroSection from "../components/HeroSection";

const initialStats = { suppliers: 0, products: 0, orders: 0, orderData: [] };

const Dashboard: React.FC = () => {
  const api = useApi();

  const fetchDashboardData = async () => {
    const { data } = await api.get('/suppliers/stats');
    return data;
  };

  const { 
    data: stats = initialStats, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardData,
  });

  const { suppliers, products, orders, orderData } = stats;

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Dashboard Analytics */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ mb: 6, color: "primary.main", fontWeight: 700, textAlign: 'center' }}>
          Platform Analytics
        </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "primary.main", color: "#fff", borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Suppliers</Typography>
              <Typography variant="h3">{isLoading ? <CircularProgress size={30} color="inherit" /> : suppliers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "secondary.main", color: "#fff", borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Products</Typography>
              <Typography variant="h3">{isLoading ? <CircularProgress size={30} color="inherit" /> : products}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "warning.main", color: "#fff", borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Orders</Typography>
              <Typography variant="h3">{isLoading ? <CircularProgress size={30} color="inherit" /> : orders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {isError ? (
        <Alert severity="error">Failed to load dashboard analytics. Please try again later.</Alert>
      ) : (
        <Paper sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "secondary.main" }}>
            Orders by Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4fd1c5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
      </Container>
    </Box>
  );
};

export default Dashboard; 