import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const columns: GridColDef[] = [
  { field: "orderNumber", headerName: "Order #", flex: 1 },
  { field: "supplier", headerName: "Supplier ID", flex: 1 },
  { field: "items", headerName: "Items", flex: 2, renderCell: (params) => <span>{Array.isArray(params.value) ? params.value.map((i: any) => `${i.product} x${i.quantity}`).join(", ") : params.value}</span> },
  { field: "totalAmount", headerName: "Total", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "paymentStatus", headerName: "Payment", flex: 1 },
];

const statusOptions = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const paymentOptions = ["Pending", "Paid", "Partial"];

const defaultForm = { orderNumber: "", supplier: "", items: "", totalAmount: "", status: "Pending", paymentStatus: "Pending" };

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

  useEffect(() => {
    setLoading(true);
    api.get("/orders").then(data => { setOrders(data); setLoading(false); }).catch(() => { setError("Failed to fetch orders"); setLoading(false); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setForm({ ...form, [e.target.name as string]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      let result;
      // Parse items as JSON array if possible
      let formToSend = { ...form };
      try {
        formToSend.items = JSON.parse(form.items);
      } catch {
        // fallback: keep as string
      }
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
      setEditing(null);
      setOpen(false);
    } catch (err) {
      setError("Failed to save order");
    }
  };

  const handleEdit = (o: any) => {
    setEditing(o._id);
    setForm({ orderNumber: o.orderNumber, supplier: o.supplier, items: JSON.stringify(o.items), totalAmount: o.totalAmount, status: o.status, paymentStatus: o.paymentStatus });
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
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <h1 style={{ color: "#1a2233", fontWeight: 700 }}>Orders</h1>
        <Button variant="contained" color="primary" onClick={() => { setForm(defaultForm); setEditing(null); setOpen(true); }}>
          Add Order
        </Button>
      </Box>
      <DataGrid
        autoHeight
        rows={orders.map(o => ({ ...o, id: o._id }))}
        columns={[
          ...columns,
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            renderCell: (params) => (
              <Box>
                <Button size="small" onClick={() => handleEdit(params.row)}>Edit</Button>
                {user?.role === "admin" && (
                  <Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
                )}
              </Box>
            ),
          },
        ]}
        loading={loading}
        disableRowSelectionOnClick
        sx={{ background: "#fff", borderRadius: 2, boxShadow: 1 }}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Edit Order" : "Add Order"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
            <TextField name="orderNumber" label="Order Number" value={form.orderNumber} onChange={handleChange} required autoFocus />
            <TextField name="supplier" label="Supplier ID" value={form.supplier} onChange={handleChange} required />
            <TextField name="items" label="Items (JSON)" value={form.items} onChange={handleChange} required helperText='e.g. [{"product":"productId","quantity":2}]' />
            <TextField name="totalAmount" label="Total Amount" value={form.totalAmount} onChange={handleChange} required type="number" />
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
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editing ? "Update" : "Add"}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={() => { setError(""); setSuccess(""); }}>
        {error ? <Alert severity="error">{error}</Alert> : success ? <Alert severity="success">{success}</Alert> : null}
      </Snackbar>
    </Box>
  );
};

export default OrdersPage; 