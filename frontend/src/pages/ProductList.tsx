import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { Box, Container, Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const api = useApi();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (category) params.append('category', category);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const uniqueCategories = [
    'Military Footwear', 'Safety Footwear', 'Official Footwear', 
    'Security Footwear', 'Industrial Footwear', 'Professional Footwear'
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 6, fontWeight: 700, textAlign: 'center' }}>
          Product Catalog
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search by name or description"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {uniqueCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" textAlign="center">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
        {products.length === 0 && !loading && (
          <Typography textAlign="center" sx={{ mt: 8 }}>No products found.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default ProductList; 