import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Paper, Container } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "../api/client";
import HeroSection from "../components/HeroSection";

const Dashboard: React.FC = () => {
  const api = useApi();
  const [stats, setStats] = useState({ suppliers: 0, products: 0, orders: 0 });
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [suppliers, products, orders] = await Promise.all([
        api.get("/suppliers"),
        api.get("/products"),
        api.get("/orders"),
      ]);
      setStats({ suppliers: suppliers.length, products: products.length, orders: orders.length });
      // Example: group orders by status for chart
      const statusCounts: Record<string, number> = {};
      orders.forEach((o: any) => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });
      setOrderData(Object.entries(statusCounts).map(([status, count]) => ({ status, count })));
      setLoading(false);
    })();
  }, []);

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
            <CardContent>
              <Typography variant="h6">Suppliers</Typography>
              <Typography variant="h3">{stats.suppliers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "secondary.main", color: "#fff", borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Products</Typography>
              <Typography variant="h3">{stats.products}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "warning.main", color: "#fff", borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Orders</Typography>
              <Typography variant="h3">{stats.orders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
      </Container>
    </Box>
  );
};

export default Dashboard; 