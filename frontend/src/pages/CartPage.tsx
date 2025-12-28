import type React from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  CircularProgress,
  Alert
} from "@mui/material"
import {
  ShoppingCart,
  Add,
  Remove,
  Delete
} from "@mui/icons-material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

const CartPage: React.FC = () => {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId)
  }

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart()
    }
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading cart...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  const isEmpty = !cart.items || cart.items.length === 0

  if (isEmpty) {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h3" component="h1">
          Shopping Cart
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearCart}
          disabled={loading}
        >
          Clear Cart
        </Button>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
        {/* Cart Items */}
        <Box>
          {cart.items.map((item) => (
            <Card key={item.product._id} sx={{ mb: 2, display: "flex" }}>
              <CardMedia
                component="img"
                sx={{ width: 150, objectFit: "cover" }}
                image={item.product.images?.[0] || "/placeholder.png"}
                alt={item.product.name}
              />
              <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" component="div">
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.product.description?.substring(0, 100)}...
                  </Typography>
                  <Typography variant="h6" color="primary">
                    KES {item.product.price?.toLocaleString() || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={loading || item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: 30, textAlign: "center" }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={loading}
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      KES {((item.product.price || 0) * item.quantity).toLocaleString()}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Order Summary */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>KES {cart.total?.toLocaleString() || 0}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Tax (16%):</Typography>
                <Typography>KES {((cart.total || 0) * 0.16).toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography>Shipping:</Typography>
                <Typography>
                  {(cart.total || 0) > 10000 ? "FREE" : "KES 500"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  KES {(
                    (cart.total || 0) +
                    (cart.total || 0) * 0.16 +
                    ((cart.total || 0) > 10000 ? 0 : 500)
                  ).toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={loading}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="text"
                fullWidth
                component={RouterLink}
                to="/products"
                sx={{ mt: 1 }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}

export default CartPage

