import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "sku", headerName: "SKU", flex: 1 },
  { field: "wholesalePrice", headerName: "Wholesale Price", flex: 1 },
  { field: "retailPrice", headerName: "Retail Price", flex: 1 },
  { field: "stockQuantity", headerName: "Stock Qty", flex: 1 },
  { field: "supplier", headerName: "Supplier ID", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

const defaultForm = { name: "", type: "", sku: "", wholesalePrice: "", retailPrice: "", stockQuantity: "", supplier: "", status: "Active" };
const productTypes = ["Shoes", "Bags", "Accessories", "Clothing"];
const statusOptions = ["Active", "Inactive", "Discontinued"];

const ProductsPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/products").then(data => { setProducts(data); setLoading(false); }).catch(() => { setError("Failed to fetch products"); setLoading(false); });
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
      if (editing) {
        result = await api.put(`/products/${editing}`, form);
        setProducts(products => products.map(p => (p._id === editing ? result : p)));
        setSuccess("Product updated!");
      } else {
        result = await api.post("/products", form);
        setProducts(products => [...products, result]);
        setSuccess("Product added!");
      }
      setForm(defaultForm);
      setEditing(null);
      setOpen(false);
    } catch (err) {
      setError("Failed to save product");
    }
  };

  const handleEdit = (p: any) => {
    setEditing(p._id);
    setForm({ name: p.name, type: p.type, sku: p.sku, wholesalePrice: p.wholesalePrice, retailPrice: p.retailPrice, stockQuantity: p.stockQuantity, supplier: p.supplier, status: p.status });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products => products.filter(p => p._id !== id));
      setSuccess("Product deleted!");
    } catch {
      setError("Failed to delete product");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <h1 style={{ color: "#1a2233", fontWeight: 700 }}>Products</h1>
        <Button variant="contained" color="primary" onClick={() => { setForm(defaultForm); setEditing(null); setOpen(true); }}>
          Add Product
        </Button>
      </Box>
      <DataGrid
        autoHeight
        rows={products.map(p => ({ ...p, id: p._id }))}
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
        <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
            <TextField name="name" label="Name" value={form.name} onChange={handleChange} required autoFocus />
            <FormControl required>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={form.type} onChange={handleSelect} label="Type">
                {productTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField name="sku" label="SKU" value={form.sku} onChange={handleChange} required />
            <TextField name="wholesalePrice" label="Wholesale Price" value={form.wholesalePrice} onChange={handleChange} required type="number" />
            <TextField name="retailPrice" label="Retail Price" value={form.retailPrice} onChange={handleChange} required type="number" />
            <TextField name="stockQuantity" label="Stock Qty" value={form.stockQuantity} onChange={handleChange} required type="number" />
            <TextField name="supplier" label="Supplier ID" value={form.supplier} onChange={handleChange} required />
            <FormControl required>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} onChange={handleSelect} label="Status">
                {statusOptions.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
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

export default ProductsPage; 