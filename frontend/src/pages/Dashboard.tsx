import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useApi } from "../api/client";

const Dashboard: React.FC = () => {
  const api = useApi();
  const [stats, setStats] = useState({ suppliers: 0, products: 0, orders: 0 });
  const [orderData, setOrderData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <Box sx={{ mt: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, color: "secondary.main", fontWeight: 700 }}>
        Dashboard Analytics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "primary.main", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Suppliers</Typography>
              <Typography variant="h3">{stats.suppliers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "primary.main", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Products</Typography>
              <Typography variant="h3">{stats.products}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "primary.main", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Orders</Typography>
              <Typography variant="h3">{stats.orders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 1 }}>
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
      </Box>
    </Box>
  );
};

export default Dashboard; 