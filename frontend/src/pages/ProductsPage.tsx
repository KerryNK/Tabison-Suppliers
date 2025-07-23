import Recommendations from '../components/Recommendations';
import Rating from '@mui/material/Rating';
import { useCallback } from 'react';
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Submit review handler
  const handleReviewSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewRating) {
      setReviewError('Please provide a rating.');
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      await api.post(`/products/${selectedProduct._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewSuccess('Review submitted!');
      setReviewRating(null);
      setReviewComment('');
      // Refresh product details (fetch again)
      fetchProducts();
    } catch (err) {
      setReviewError('Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  }, [selectedProduct, reviewRating, reviewComment, api]);
import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, TextField, Stack } from "@mui/material";
import { motion, useAnimation } from 'framer-motion';
  // Animation controls for Add to Cart button
  const cartAnim = useAnimation();
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from '../context/CartContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slider from '@mui/material/Slider';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
  // Debounce ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = async (cat = category, s = search, so = sort, pr = priceRange, tg = tag) => {
    setLoading(true);
    let url = "/products";
    const params: string[] = [];
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


  // Initial fetch
  useEffect(() => { fetchProducts(); /* eslint-disable-next-line */ }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(category, search, sort, priceRange, tag);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setSuccess(`${product.name} added to cart!`);
    cartAnim.start({ scale: [1, 1.15, 0.95, 1], transition: { duration: 0.4 } });
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
    fetchProducts(e.target.value, search);
  };


  // Keep the search button for accessibility, but not required for live search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(category, search, sort, priceRange, tag);
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
        <form onSubmit={handleSearch} className="product-search-form" autoComplete="off">
          <TextField
            size="small"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
            inputProps={{ 'aria-label': 'Search products' }}
          />
          <Button type="submit" variant="contained" color="secondary" sx={{ ml: 1, fontWeight: 700 }}>Search</Button>
        </form>
      </Stack>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card onClick={() => setSelectedProduct(product)} sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }, position: 'relative', overflow: 'visible' }}>
              {/* Badges for New/Best Seller */}
              {product.tags && product.tags.includes('New') && (
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, bgcolor: 'primary.main', color: '#fff', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 12, fontWeight: 700 }}>New</Box>
              )}
              {product.tags && product.tags.includes('Best Seller') && (
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'secondary.main', color: '#fff', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 12, fontWeight: 700 }}>Best Seller</Box>
              )}
              {product.images && product.images[0] ? (
                <CardMedia component="img" image={product.images[0]} alt={product.name} sx={{ height: 200, objectFit: 'cover', bgcolor: '#f9f9f9', borderRadius: 2, mt: 1 }} />
              ) : (
                <Box sx={{ height: 200, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mt: 1 }}>
                  <Typography color="text.secondary">No Image</Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main', textAlign: 'center', width: '100%' }}>{product.name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{product.type}</Typography>
                <Typography variant="body1" sx={{ color: 'secondary.main', mb: 2, fontWeight: 600 }}>Ksh {product.retailPrice}</Typography>
                <Button variant="contained" color="secondary" onClick={e => { e.stopPropagation(); setSelectedProduct(product); }} sx={{ mt: 'auto', fontWeight: 700, width: '100%' }}>
                  Quick View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={() => { setError(""); setSuccess(""); }}>
        {error ? <Alert severity="error">{error}</Alert> : success ? <Alert severity="success">{success}</Alert> : null}
      </Snackbar>
      {/* Enhanced Quick View Modal */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="sm" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}
                  >
                    {selectedProduct.images.map((img: string, idx: number) => (
                      <SwiperSlide key={idx}>
                        <Zoom>
                          <img
                            src={img}
                            alt={selectedProduct.name + '-' + idx}
                            style={{ width: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 8, background: '#f9f9f9', cursor: 'zoom-in' }}
                          />
                        </Zoom>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  {/* Thumbnails */}
                  {selectedProduct.images.length > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                      {selectedProduct.images.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={selectedProduct.name + '-thumb-' + idx}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee', background: '#fff' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{selectedProduct.type}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>{selectedProduct.description || 'No description available.'}</Typography>
              <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>Ksh {selectedProduct.retailPrice}</Typography>
              <Typography variant="body2" color={selectedProduct.stockQuantity > 0 ? 'success.main' : 'error.main'} sx={{ mb: 1 }}>
                {selectedProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </Typography>
              {/* Features */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Features:</Typography>
                  <ul className="product-modal-list">
                    {selectedProduct.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </Box>
              )}
              {/* Cost Breakdown */}
              {selectedProduct.costBreakdown && (
                <Box sx={{ mb: 2, bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cost Breakdown:</Typography>
                  <ul className="product-modal-list">
                    {Object.entries(selectedProduct.costBreakdown).map(([k, v]) => (
                      <li key={k} className="product-modal-breakdown-row">
                        <span className="product-modal-breakdown-key">{k.replace(/_/g, ' ')}</span>
                        <span className="product-modal-breakdown-value">{v}</span>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              {/* Size/Quantity selection */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  size="small"
                  defaultValue={1}
                  inputProps={{ min: 1, max: selectedProduct.stockQuantity || 99 }}
                  sx={{ width: 100 }}
                  onChange={e => selectedProduct.selectedQty = parseInt(e.target.value) || 1}
                />
                {/* Example: if you want to add size selection, add a Select here */}
                {/* <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Size</InputLabel>
                  <Select label="Size" defaultValue="M">
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                  </Select>
                </FormControl> */}
              </Box>
            {/* Product Reviews */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Reviews</Typography>
              {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                <Box sx={{ maxHeight: 180, overflowY: 'auto', mb: 2 }}>
                  {selectedProduct.reviews.map((rev: any, idx: number) => (
                    <Box key={idx} sx={{ mb: 1.5, p: 1.5, bgcolor: '#f7f7f7', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={rev.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{rev.user?.username || 'User'}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{rev.date ? new Date(rev.date).toLocaleDateString() : ''}</Typography>
                      </Box>
                      {rev.comment && <Typography variant="body2" sx={{ mt: 0.5 }}>{rev.comment}</Typography>}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
              )}
              {/* Review Form */}
              {user && (
                <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 2, bgcolor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Leave a Review</Typography>
                  <Rating
                    value={reviewRating}
                    onChange={(_, newValue) => setReviewRating(newValue)}
                    size="large"
                  />
                  <TextField
                    label="Comment"
                    multiline
                    minRows={2}
                    fullWidth
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                  <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }} disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  {reviewError && <Typography color="error" sx={{ mt: 1 }}>{reviewError}</Typography>}
                  {reviewSuccess && <Typography color="success.main" sx={{ mt: 1 }}>{reviewSuccess}</Typography>}
                </Box>
              )}
            </Box>
            {/* Recommendations */}
            <Recommendations currentProduct={selectedProduct} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedProduct(null)} color="primary">Close</Button>
              <motion.div animate={cartAnim} style={{ width: '100%' }}>
                <Button variant="contained" color="secondary" fullWidth onClick={() => { handleAddToCart({ ...selectedProduct, quantity: selectedProduct.selectedQty || 1 }); setSelectedProduct(null); }}>
                  Add to Cart
                </Button>
              </motion.div>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProductsPage; 