import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useApi } from "../api/client";

const FavoritesPage: React.FC = () => {
  const api = useApi();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favs.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    api.get(`/products?ids=${favs.join(",")}`)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [api]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>
        My Favorites
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : products.length === 0 ? (
        <Typography color="text.secondary">No favorite products yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} onQuickView={() => {}} onAddToCart={() => {}} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FavoritesPage;
