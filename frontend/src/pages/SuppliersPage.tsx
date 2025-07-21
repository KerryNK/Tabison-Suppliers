import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box, Rating } from "@mui/material";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Phone", flex: 1 },
  { field: "address", headerName: "Address", flex: 1 },
  { field: "rating", headerName: "Rating", flex: 0.5, renderCell: (params) => <Rating value={params.value || 0} readOnly size="small" /> },
];

const defaultForm = { name: "", email: "", phone: "", address: "", rating: 0 };

const SuppliersPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/suppliers").then(data => { setSuppliers(data); setLoading(false); }).catch(() => { setError("Failed to fetch suppliers"); setLoading(false); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRating = (_: any, value: number | null) => {
    setForm({ ...form, rating: value || 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      let result;
      if (editing) {
        result = await api.put(`/suppliers/${editing}`, form);
        setSuppliers(suppliers => suppliers.map(s => (s._id === editing ? result : s)));
        setSuccess("Supplier updated!");
      } else {
        result = await api.post("/suppliers", form);
        setSuppliers(suppliers => [...suppliers, result]);
        setSuccess("Supplier added!");
      }
      setForm(defaultForm);
      setEditing(null);
      setOpen(false);
    } catch (err) {
      setError("Failed to save supplier");
    }
  };

  const handleEdit = (s: any) => {
    setEditing(s._id);
    setForm({ name: s.name, email: s.email, phone: s.phone, address: s.address, rating: s.rating || 0 });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers => suppliers.filter(s => s._id !== id));
      setSuccess("Supplier deleted!");
    } catch {
      setError("Failed to delete supplier");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <h1 style={{ color: "#1a2233", fontWeight: 700 }}>Suppliers</h1>
        <Button variant="contained" color="primary" onClick={() => { setForm(defaultForm); setEditing(null); setOpen(true); }}>
          Add Supplier
        </Button>
      </Box>
      <DataGrid
        autoHeight
        rows={suppliers.map(s => ({ ...s, id: s._id }))}
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
        <DialogTitle>{editing ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 350 }}>
            <TextField name="name" label="Name" value={form.name} onChange={handleChange} required autoFocus />
            <TextField name="email" label="Email" value={form.email} onChange={handleChange} required type="email" />
            <TextField name="phone" label="Phone" value={form.phone} onChange={handleChange} required />
            <TextField name="address" label="Address" value={form.address} onChange={handleChange} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>Rating:</span>
              <Rating name="rating" value={form.rating} onChange={handleRating} />
            </Box>
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

export default SuppliersPage; 