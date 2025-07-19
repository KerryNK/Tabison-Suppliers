import React, { useEffect, useState } from "react";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const SuppliersPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    api.get("/suppliers").then(setSuppliers).catch(() => setError("Failed to fetch suppliers"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        const updated = await api.put(`/suppliers/${editing}`, form);
        setSuppliers(suppliers => suppliers.map(s => (s._id === editing ? updated : s)));
        setEditing(null);
      } else {
        const created = await api.post("/suppliers", form);
        setSuppliers(suppliers => [...suppliers, created]);
      }
      setForm({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      setError("Failed to save supplier");
    }
  };

  const handleEdit = (s: any) => {
    setEditing(s._id);
    setForm({ name: s.name, email: s.email, phone: s.phone, address: s.address });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this supplier?")) return;
    await api.delete(`/suppliers/${id}`);
    setSuppliers(suppliers => suppliers.filter(s => s._id !== id));
  };

  return (
    <div>
      <h1>Suppliers</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <button type="submit">{editing ? "Update" : "Add"} Supplier</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", email: "", phone: "", address: "" }); }}>Cancel</button>}
      </form>
      <ul>
        {suppliers.map(s => (
          <li key={s._id}>
            {s.name} ({s.email}) {s.phone} {s.address}
            <button onClick={() => handleEdit(s)}>Edit</button>
            {user?.role === "admin" && (
              <button onClick={() => handleDelete(s._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuppliersPage; 