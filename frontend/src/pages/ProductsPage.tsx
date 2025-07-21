import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, TextField, Stack } from "@mui/material";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from '../context/CartContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slider from '@mui/material/Slider';

const categories = ["All", "Shoes", "Bags", "Accessories", "Clothing", "General"];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
];
const tagOptions = ['All', 'New', 'Best Seller'];

const ProductsPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [tag, setTag] = useState('All');

  const fetchProducts = async (cat = category, s = search, so = sort, pr = priceRange, tg = tag) => {
    setLoading(true);
    let url = "/products";
    const params = [];
    if (cat && cat !== "All") params.push(`category=${encodeURIComponent(cat)}`);
    if (s) params.push(`search=${encodeURIComponent(s)}`);
    if (so) params.push(`sort=${encodeURIComponent(so)}`);
    if (pr && (pr[0] > 0 || pr[1] < 10000)) {
      params.push(`minPrice=${pr[0]}`);
      params.push(`maxPrice=${pr[1]}`);
    }
    if (tg && tg !== 'All') params.push(`tag=${encodeURIComponent(tg)}`);
    if (params.length) url += `?${params.join("&")}`;
    api.get(url).then(data => { setProducts(data); setLoading(false); }).catch(() => { setError("Failed to fetch products"); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); /* eslint-disable-next-line */ }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setSuccess(`${product.name} added to cart!`);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
    fetchProducts(e.target.value, search);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(category, search);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>
        Products
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, justifyContent: 'center', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => { setCategory(e.target.value); fetchProducts(e.target.value, search, sort, priceRange, tag); }}>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} label="Sort By" onChange={e => { setSort(e.target.value); fetchProducts(category, search, e.target.value, priceRange, tag); }}>
            {sortOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Tag</InputLabel>
          <Select value={tag} label="Tag" onChange={e => { setTag(e.target.value); fetchProducts(category, search, sort, priceRange, e.target.value); }}>
            {tagOptions.map(tg => <MenuItem key={tg} value={tg}>{tg}</MenuItem>)}
          </Select>
        </FormControl>
        <Box sx={{ width: 180, px: 2 }}>
          <Typography variant="caption" color="text.secondary">Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => { setPriceRange(newValue as number[]); }}
            onChangeCommitted={(_, newValue) => fetchProducts(category, search, sort, newValue as number[], tag)}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={100}
            sx={{ mt: 1 }}
          />
        </Box>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <Button type="submit" variant="contained" color="secondary" sx={{ ml: 1, fontWeight: 700 }}>Search</Button>
        </form>
      </Stack>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card onClick={() => setSelectedProduct(product)} sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
              {product.images && product.images[0] ? (
                <CardMedia component="img" image={product.images[0]} alt={product.name} sx={{ height: 180, objectFit: 'contain', bgcolor: '#f9f9f9' }} />
              ) : (
                <Box sx={{ height: 180, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No Image</Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', textAlign: 'center' }}>{product.name}</Typography>
                <Typography variant="body1" sx={{ color: 'secondary.main', mb: 2, fontWeight: 600 }}>Ksh {product.retailPrice}</Typography>
                <Button variant="contained" color="secondary" onClick={e => { e.stopPropagation(); handleAddToCart(product); }} sx={{ mt: 'auto', fontWeight: 700 }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={() => { setError(""); setSuccess(""); }}>
        {error ? <Alert severity="error">{error}</Alert> : success ? <Alert severity="success">{success}</Alert> : null}
      </Snackbar>
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="sm" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              {selectedProduct.images && selectedProduct.images[0] && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img src={selectedProduct.images[0]} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: 240 }} />
                </Box>
              )}
              <Typography variant="body1" sx={{ mb: 1 }}>{selectedProduct.description || 'No description available.'}</Typography>
              <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>Ksh {selectedProduct.retailPrice}</Typography>
              <Typography variant="body2" color={selectedProduct.stockQuantity > 0 ? 'success.main' : 'error.main'}>
                {selectedProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedProduct(null)} color="primary">Close</Button>
              <Button variant="contained" color="secondary" onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}>Add to Cart</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProductsPage; 