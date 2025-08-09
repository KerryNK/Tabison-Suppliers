import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useApi } from "../api/client";

interface RecommendationsProps {
  currentProduct?: any;
  user?: any;
}

const Recommendations: React.FC<RecommendationsProps> = ({ currentProduct, user }) => {
  const api = useApi();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let url = "/products?limit=8";
    if (currentProduct && currentProduct.category) {
      url += `&category=${encodeURIComponent(currentProduct.category)}`;
    } else if (user && user.favorites && user.favorites.length > 0) {
      url += `&ids=${user.favorites.join(",")}`;
    }
    api.get(url).then(setProducts);
  }, [api, currentProduct, user]);

  if (!products.length) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        You may also like
      </Typography>
      <Grid container spacing={2}>
        {products.filter(p => !currentProduct || p._id !== currentProduct._id).slice(0, 4).map(product => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <ProductCard product={product} onQuickView={() => {}} onAddToCart={() => {}} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recommendations;
