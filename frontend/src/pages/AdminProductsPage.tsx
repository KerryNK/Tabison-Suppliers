import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Paper, FormControl, InputLabel, Select, MenuItem, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const categories = ["Shoes", "Bags", "Accessories", "Clothing", "General"];
const tagOptions = ["New", "Best Seller"];

const defaultForm = { name: '', sku: '', wholesalePrice: '', retailPrice: '', stockQuantity: '', supplier: '', status: 'Active', description: '', category: 'General', tags: [], images: [] };

const AdminProductsPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectionModel, setSelectionModel] = useState<string[]>([]);
  const [viewProduct, setViewProduct] = useState<any | null>(null);

  const fetchProducts = async (cat = category, s = search) => {
    setLoading(true);
    let url = '/products';
    const params = [];
    if (cat && cat !== 'All') params.push(`category=${encodeURIComponent(cat)}`);
    if (s) params.push(`search=${encodeURIComponent(s)}`);
    if (params.length) url += `?${params.join('&')}`;
    api.get(url).then(data => { setProducts(data); setLoading(false); }).catch(() => { setError('Failed to fetch products'); setLoading(false); });
  };

  useEffect(() => { if (user?.role === 'admin') fetchProducts(); }, [user]);

  if (user?.role !== 'admin') {
    return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error">Access denied. Admins only.</Typography></Box>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleTags = (e: any) => {
    setForm({ ...form, tags: e.target.value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tags') v.forEach((tag: string) => formData.append('tags', tag));
      else formData.append(k, v);
    });
    imageFiles.forEach(file => formData.append('images', file));
    try {
      let result;
      if (editing) {
        result = await api.put(`/products/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts(products => products.map(p => (p._id === editing ? result : p)));
        setSuccess('Product updated!');
      } else {
        result = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProducts(products => [...products, result]);
        setSuccess('Product added!');
      }
      setForm(defaultForm);
      setImageFiles([]);
      setEditing(null);
      setOpen(false);
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleEdit = (p: any) => {
    setEditing(p._id);
    setForm({ ...defaultForm, ...p, tags: p.tags || [] });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products => products.filter(p => p._id !== id));
      setSuccess('Product deleted!');
    } catch {
      setError('Failed to delete product');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!selectionModel.length) return;
    if (!window.confirm('Delete selected products?')) return;
    try {
      await Promise.all(selectionModel.map(id => api.delete(`/products/${id}`)));
      setProducts(products => products.filter(p => !selectionModel.includes(p._id)));
      setSuccess('Selected products deleted!');
      setSelectionModel([]);
    } catch {
      setError('Failed to delete selected products');
    }
  };

  // Inline update for price/stock
  const handleInlineEdit = async (id: string, field: string, value: any) => {
    try {
      const updated = await api.put(`/products/${id}`, { [field]: value });
      setProducts(products => products.map(p => p._id === id ? { ...p, ...updated } : p));
      setSuccess('Product updated!');
    } catch {
      setError('Failed to update product');
    }
  };

  const columns: GridColDef[] = [
    { field: 'images', headerName: 'Image', flex: 0.7, renderCell: (params) => params.value && params.value[0] ? <img src={params.value[0]} alt="Product" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} loading="lazy" /> : null },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'retailPrice',
      headerName: 'Retail Price',
      flex: 1,
      renderCell: (params) => (
        <TextField
          size="small"
          type="number"
          defaultValue={params.value}
          onBlur={e => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val !== params.value) handleInlineEdit(params.row._id, 'retailPrice', val);
          }}
          sx={{ width: 100 }}
        />
      )
    },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      flex: 1,
      renderCell: (params) => (
        <TextField
          size="small"
          type="number"
          defaultValue={params.value}
          onBlur={e => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val !== params.value) handleInlineEdit(params.row._id, 'stockQuantity', val);
          }}
          sx={{ width: 80 }}
        />
      )
    },
    { field: 'tags', headerName: 'Tags', flex: 1, renderCell: (params) => params.value?.map((tag: string) => <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />) },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details"><IconButton size="small" color="info" onClick={() => setViewProduct(params.row)}><span className="material-icons">visibility</span></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}><EditIcon /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>Admin Product Management</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => { setForm(defaultForm); setEditing(null); setOpen(true); }}>Add Product</Button>
        <Button variant="outlined" color="error" disabled={!selectionModel.length} onClick={handleBulkDelete}>Delete Selected</Button>
      </Box>
      {/* Product Details Modal for Admins */}
      <Dialog open={!!viewProduct} onClose={() => setViewProduct(null)} maxWidth="sm" fullWidth>
        {viewProduct && (
          <>
            <DialogTitle>{viewProduct.name}</DialogTitle>
            <DialogContent>
              {viewProduct.images && viewProduct.images[0] && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img src={viewProduct.images[0]} alt={viewProduct.name} style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8 }} />
                </Box>
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{viewProduct.type}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>{viewProduct.description || 'No description available.'}</Typography>
              <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>Ksh {viewProduct.retailPrice}</Typography>
              <Typography variant="body2" color={viewProduct.stockQuantity > 0 ? 'success.main' : 'error.main'} sx={{ mb: 1 }}>
                {viewProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </Typography>
              {/* Features */}
              {viewProduct.features && viewProduct.features.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Features:</Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {viewProduct.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </Box>
              )}
              {/* Cost Breakdown */}
              {viewProduct.costBreakdown && (
                <Box sx={{ mb: 2, bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cost Breakdown:</Typography>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {Object.entries(viewProduct.costBreakdown).map(([k, v]) => (
                      <li key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                        <span style={{ fontFamily: 'monospace' }}>{v}</span>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewProduct(null)} color="primary">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField size="small" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') fetchProducts(category, search); }} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => { setCategory(e.target.value); fetchProducts(e.target.value, search); }}>
            <MenuItem value="All">All</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => fetchProducts(category, search)}>Filter</Button>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
        <DataGrid
          autoHeight
          rows={products.map(p => ({ ...p, id: p._id }))}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          checkboxSelection
          onRowSelectionModelChange={setSelectionModel}
          rowSelectionModel={selectionModel}
          sx={{ background: '#fff', borderRadius: 2, boxShadow: 1 }}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            <TextField name="name" label="Name" value={form.name} onChange={handleChange} required autoFocus />
            <TextField name="sku" label="SKU" value={form.sku} onChange={handleChange} required />
            <TextField name="wholesalePrice" label="Wholesale Price" value={form.wholesalePrice} onChange={handleChange} required type="number" />
            <TextField name="retailPrice" label="Retail Price" value={form.retailPrice} onChange={handleChange} required type="number" />
            <TextField name="stockQuantity" label="Stock Qty" value={form.stockQuantity} onChange={handleChange} required type="number" />
            <FormControl required>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={form.category} onChange={handleSelect} label="Category">
                {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl required>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} onChange={handleSelect} label="Status">
                {['Active', 'Inactive', 'Discontinued'].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField name="description" label="Description" value={form.description} onChange={handleChange} multiline minRows={2} />
            <FormControl>
              <InputLabel>Tags</InputLabel>
              <Select name="tags" multiple value={form.tags} onChange={handleTags} label="Tags" renderValue={(selected) => (selected as string[]).map(tag => <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />)}>
                {tagOptions.map(tag => <MenuItem key={tag} value={tag}>{tag}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="outlined" component="label">Upload Images
              <input type="file" name="images" multiple hidden onChange={handleImageChange} accept="image/*" />
            </Button>
            {imageFiles.length > 0 && <Typography variant="caption">{imageFiles.length} image(s) selected</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editing ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={() => { setError(''); setSuccess(''); }}>
        {error ? <Alert severity="error">{error}</Alert> : success ? <Alert severity="success">{success}</Alert> : null}
      </Snackbar>
    </Box>
  );
};

export default AdminProductsPage;
