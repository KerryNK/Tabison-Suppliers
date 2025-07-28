"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material"
import { Search } from "@mui/icons-material"
import { useQuery } from "@tanstack/react-query"
import { useApi } from "../api/client"

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const api = useApi()

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", { search: searchTerm, category }],
    queryFn: () => api.getProducts({ search: searchTerm, category }),
  })

  const products = productsData?.data?.data || []

  const categories = [
    { value: "", label: "All Categories" },
    { value: "military", label: "Military Footwear" },
    { value: "safety", label: "Safety Footwear" },
    { value: "official", label: "Official Footwear" },
    { value: "industrial", label: "Industrial Footwear" },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Our Products
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Browse our comprehensive collection of military, safety, and professional footwear
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>Loading products...</Typography>
        </Box>
      ) : products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product: any) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images?.[0] || "/placeholder.svg?height=200&width=300"}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Chip label={product.category} size="small" color="primary" sx={{ mb: 2 }} />
                  <Typography variant="h6" color="primary.main">
                    KSh {product.price?.toLocaleString()}
                  </Typography>
                  {product.retailPrice && (
                    <Typography variant="body2" color="text.secondary">
                      Retail: KSh {product.retailPrice.toLocaleString()}
                    </Typography>
                  )}
                  <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria or browse all categories
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default ProductsPage
