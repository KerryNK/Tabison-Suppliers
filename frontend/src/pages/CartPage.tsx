import type React from "react"
import { Box, Container, Typography, Button } from "@mui/material"
import { ShoppingCart } from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"

const CartPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Shopping Cart
      </Typography>

      <Box sx={{ textAlign: "center", py: 8 }}>
        <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add some products to get started
        </Typography>
        <Button variant="contained" component={RouterLink} to="/products" size="large">
          Browse Products
        </Button>
      </Box>
    </Container>
  )
}

export default CartPage
