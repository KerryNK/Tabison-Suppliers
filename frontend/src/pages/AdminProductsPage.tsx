
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Card, CardContent, CardMedia, IconButton, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Switch, FormControlLabel, Select, MenuItem, FormControl,
  InputLabel, Alert, Snackbar, CircularProgress, Tabs, Tab
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as OrderIcon,
  People as CustomerIcon
} from '@mui/icons-material';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    retailPrice: '',
    category: '',
    type: '',
    stock: '',
    images: [],
    specifications: {
      size: [],
      color: [],
      material: '',
      weight: '',
      certification: []
    }
  });

  const categories = [
    'military-boots',
    'safety-footwear', 
    'professional-equipment',
    'accessories'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/users')
      ]);
      
      setProducts(await productsRes.json());
      setOrders(await ordersRes.json());
      setCustomers(await customersRes.json());
    } catch (error) {
      showAlert('Failed to fetch data', 'error');
    }
    setLoading(false);
  };

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        showAlert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`, 'success');
        setOpen(false);
        resetForm();
        fetchData();
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      showAlert(error.message, 'error');
    }
    
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        showAlert('Product deleted successfully!', 'success');
        fetchData();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      retailPrice: product.retailPrice.toString(),
      category: product.category,
      type: product.type,
      stock: product.stock.toString(),
      images: product.images,
      specifications: product.specifications || {
        size: [],
        color: [],
        material: '',
        weight: '',
        certification: []
      }
    });
    setOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      retailPrice: '',
      category: '',
      type: '',
      stock: '',
      images: [],
      specifications: {
        size: [],
        color: [],
        material: '',
        weight: '',
        certification: []
      }
    });
    setEditingProduct(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        showAlert('Order status updated!', 'success');
        fetchData();
      }
    } catch (error) {
      showAlert('Failed to update order status', 'error');
    }
  };

  const renderProductsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Product Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img 
                    src={product.images?.[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.category} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>Ksh {product.retailPrice?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={product.stock || 0}
                    color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={product.isActive}
                    size="small"
                    onChange={(e) => {
                      // Handle status toggle
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(product._id)} 
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderOrdersTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Order Management</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Typography variant="subtitle2">{order.orderNumber}</Typography>
                </TableCell>
                <TableCell>
                  {order.customer?.name || order.customer?.email || 'Unknown'}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  Ksh {order.payment?.amount?.total?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.payment?.status} 
                    color={order.payment?.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AnalyticsIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Products
                </Typography>
                <Typography variant="h4">
                  {products.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <OrderIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h4">
                  {orders.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomerIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Customers
                </Typography>
                <Typography variant="h4">
                  {customers.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AnalyticsIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Revenue (KSH)
                </Typography>
                <Typography variant="h4">
                  {orders.filter(o => o.payment?.status === 'completed')
                    .reduce((sum, o) => sum + (o.payment?.amount?.total || 0), 0)
                    .toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Products" />
          <Tab label="Orders" />
          <Tab label="Customers" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && renderProductsTab()}
        {activeTab === 1 && renderOrdersTab()}
        {activeTab === 2 && (
          <Typography>Customer management coming soon...</Typography>
        )}
      </Box>

      {/* Product Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>
                        {cat.replace('-', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Type/Model"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Cost Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Retail Price"
                  type="number"
                  value={form.retailPrice}
                  onChange={(e) => setForm({...form, retailPrice: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({...form, stock: e.target.value})}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({...alert, open: false})}
      >
        <Alert 
          onClose={() => setAlert({...alert, open: false})} 
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProductsPage;
