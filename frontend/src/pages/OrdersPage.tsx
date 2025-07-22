import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box, MenuItem, Select, InputLabel, FormControl, IconButton, Paper, Typography } from "@mui/material";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';

const OrdersPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<{ product: string, quantity: number }[]>([]);

  // Move columns definition here so it can access products
  const columns: GridColDef[] = [
    { field: "orderNumber", headerName: "Order #", flex: 1 },
    { field: "supplier", headerName: "Supplier ID", flex: 1 },
    {
      field: "items",
      headerName: "Items",
      flex: 2,
      renderCell: (params) => {
        const productsMap = Object.fromEntries(products.map(p => [p._id, p.name]));
        return Array.isArray(params.value)
          ? params.value.map((i: any) => `${productsMap[i.product?._id || i.product] || i.product} x${i.quantity}`).join(", ")
          : params.value;
      }
    },
    { field: "totalAmount", headerName: "Total", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "paymentStatus", headerName: "Payment", flex: 1 },
  ];

  const statusOptions = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  const paymentOptions = ["Pending", "Paid", "Partial"];

  const defaultForm = { orderNumber: "", supplier: "", items: "", totalAmount: "", status: "Pending", paymentStatus: "Pending" };

  useEffect(() => {
    setLoading(true);
    api.get("/orders").then(data => { setOrders(data); setLoading(false); }).catch(() => { setError("Failed to fetch orders"); setLoading(false); });
    api.get("/products").then(setProducts);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setForm({ ...form, [e.target.name as string]: e.target.value });
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: products[0]?._id || '', quantity: 1 }]);
  };
  const handleItemChange = (idx: number, field: string, value: any) => {
    setOrderItems(orderItems.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleRemoveItem = (idx: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      let result;
      const formToSend = { ...form, items: orderItems, totalAmount: orderItems.reduce((sum, i) => {
        const prod = products.find(p => p._id === i.product);
        return sum + (prod ? prod.retailPrice * i.quantity : 0);
      }, 0) };
      if (editing) {
        result = await api.put(`/orders/${editing}`, formToSend);
        setOrders(orders => orders.map(o => (o._id === editing ? result : o)));
        setSuccess("Order updated!");
      } else {
        result = await api.post("/orders", formToSend);
        setOrders(orders => [...orders, result]);
        setSuccess("Order added!");
      }
      setForm(defaultForm);
      setOrderItems([]);
      setEditing(null);
      setOpen(false);
    } catch (err) {
      setError("Failed to save order");
    }
  };

  const handleEdit = (o: any) => {
    setEditing(o._id);
    setForm({ orderNumber: o.orderNumber, supplier: o.supplier, items: '', totalAmount: o.totalAmount, status: o.status, paymentStatus: o.paymentStatus });
    setOrderItems(o.items.map((i: any) => ({ product: i.product._id || i.product, quantity: i.quantity })));
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders => orders.filter(o => o._id !== id));
      setSuccess("Order deleted!");
    } catch {
      setError("Failed to delete order");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>Orders</Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 2 }} onClick={() => { setForm(defaultForm); setEditing(null); setOpen(true); }}>
            Add Order
          </Button>
        </Box>
        <Paper sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1, mb: 4 }}>
          <DataGrid
            autoHeight
            rows={orders.map(o => ({ ...o, id: o._id }))}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            sx={{ background: '#fff', borderRadius: 2, boxShadow: 1 }}
          />
        </Paper>
        <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', pb: 0 }}>{editing ? "Edit Order" : "Add Order"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400, pt: 1 }}>
              <TextField name="orderNumber" label="Order Number" value={form.orderNumber} onChange={handleChange} required autoFocus />
              <TextField name="supplier" label="Supplier ID" value={form.supplier} onChange={handleChange} required />
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <b>Order Items</b>
                  <Button size="small" onClick={handleAddItem}>Add Item</Button>
                </Box>
                {orderItems.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FormControl sx={{ minWidth: 120, mr: 1 }} size="small">
                      <Select value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                        {products.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField type="number" size="small" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))} inputProps={{ min: 1 }} sx={{ width: 80, mr: 1 }} />
                    <IconButton onClick={() => handleRemoveItem(idx)}><DeleteIcon /></IconButton>
                  </Box>
                ))}
              </Box>
              <TextField name="totalAmount" label="Total Amount" value={orderItems.reduce((sum, i) => {
                const prod = products.find(p => p._id === i.product);
                return sum + (prod ? prod.retailPrice * i.quantity : 0);
              }, 0)} inputProps={{ readOnly: true }} required type="number" />
              <FormControl required>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={form.status} onChange={handleSelect} label="Status">
                  {statusOptions.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl required>
                <InputLabel>Payment Status</InputLabel>
                <Select name="paymentStatus" value={form.paymentStatus} onChange={handleSelect} label="Payment Status">
                  {paymentOptions.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ pb: 2, pr: 3 }}>
              <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
              <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700 }}>{editing ? "Update" : "Add"}</Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={() => { setError(""); setSuccess(""); }}>
          {error ? <Alert severity="error">{error}</Alert> : success ? <Alert severity="success">{success}</Alert> : null}
        </Snackbar>
      </Box>
    </Box>
  );
};

export default OrdersPage; 