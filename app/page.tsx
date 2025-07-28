"use client"

import type React from "react"
import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Page: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Tabison Suppliers
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your trusted partner for military, safety, and professional footwear
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate("/products")} sx={{ mt: 2 }}>
          Browse Products
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Military Footwear
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High-quality combat boots and tactical footwear for military and law enforcement professionals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Safety Equipment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Industrial safety boots and protective gear meeting international safety standards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Professional Gear
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Specialized footwear and equipment for various professional applications.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Page
