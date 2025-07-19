import React, { useEffect, useState } from "react";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const ProductsPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", sku: "", wholesalePrice: "", retailPrice: "", stockQuantity: "", supplier: "", status: "Active" });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get("/products").then(data => { setProducts(data); setLoading(false); }).catch(() => { setError("Failed to fetch products"); setLoading(false); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      if (editing) {
        const updated = await api.put(`/products/${editing}`, form);
        setProducts(products => products.map(p => (p._id === editing ? updated : p)));
        setEditing(null);
        setSuccess("Product updated!");
      } else {
        const created = await api.post("/products", form);
        setProducts(products => [...products, created]);
        setSuccess("Product added!");
      }
      setForm({ name: "", type: "", sku: "", wholesalePrice: "", retailPrice: "", stockQuantity: "", supplier: "", status: "Active" });
    } catch (err) {
      setError("Failed to save product");
    }
  };

  const handleEdit = (p: any) => {
    setEditing(p._id);
    setForm({ name: p.name, type: p.type, sku: p.sku, wholesalePrice: p.wholesalePrice, retailPrice: p.retailPrice, stockQuantity: p.stockQuantity, supplier: p.supplier, status: p.status });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts(products => products.filter(p => p._id !== id));
    setSuccess("Product deleted!");
  };

  return (
    <div>
      <h1>Products</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      {loading && <div>Loading...</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" required />
        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" required />
        <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} placeholder="Wholesale Price" required />
        <input name="retailPrice" value={form.retailPrice} onChange={handleChange} placeholder="Retail Price" required />
        <input name="stockQuantity" value={form.stockQuantity} onChange={handleChange} placeholder="Stock Qty" required />
        <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier ID" required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Discontinued">Discontinued</option>
        </select>
        <button type="submit">{editing ? "Update" : "Add"} Product</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", type: "", sku: "", wholesalePrice: "", retailPrice: "", stockQuantity: "", supplier: "", status: "Active" }); }}>Cancel</button>}
      </form>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} ({p.type}) SKU: {p.sku} Wholesale: {p.wholesalePrice} Retail: {p.retailPrice} Stock: {p.stockQuantity} Supplier: {p.supplier} Status: {p.status}
            <button onClick={() => handleEdit(p)}>Edit</button>
            {user?.role === "admin" && (
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage; 