import React, { useEffect, useState } from "react";
import { useApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const OrdersPage: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ orderNumber: "", supplier: "", items: "", totalAmount: "", status: "Pending", paymentStatus: "Pending" });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get("/orders").then(data => { setOrders(data); setLoading(false); }).catch(() => { setError("Failed to fetch orders"); setLoading(false); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      if (editing) {
        const updated = await api.put(`/orders/${editing}`, form);
        setOrders(orders => orders.map(o => (o._id === editing ? updated : o)));
        setEditing(null);
        setSuccess("Order updated!");
      } else {
        const created = await api.post("/orders", form);
        setOrders(orders => [...orders, created]);
        setSuccess("Order added!");
      }
      setForm({ orderNumber: "", supplier: "", items: "", totalAmount: "", status: "Pending", paymentStatus: "Pending" });
    } catch (err) {
      setError("Failed to save order");
    }
  };

  const handleEdit = (o: any) => {
    setEditing(o._id);
    setForm({ orderNumber: o.orderNumber, supplier: o.supplier, items: o.items, totalAmount: o.totalAmount, status: o.status, paymentStatus: o.paymentStatus });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    setOrders(orders => orders.filter(o => o._id !== id));
    setSuccess("Order deleted!");
  };

  return (
    <div>
      <h1>Orders</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      {loading && <div>Loading...</div>}
      <form onSubmit={handleSubmit}>
        <input name="orderNumber" value={form.orderNumber} onChange={handleChange} placeholder="Order Number" required />
        <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier ID" required />
        <input name="items" value={form.items} onChange={handleChange} placeholder="Items (JSON)" required />
        <input name="totalAmount" value={form.totalAmount} onChange={handleChange} placeholder="Total Amount" required />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
        </select>
        <button type="submit">{editing ? "Update" : "Add"} Order</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ orderNumber: "", supplier: "", items: "", totalAmount: "", status: "Pending", paymentStatus: "Pending" }); }}>Cancel</button>}
      </form>
      <ul>
        {orders.map(o => (
          <li key={o._id}>
            {o.orderNumber} Supplier: {o.supplier} Items: {JSON.stringify(o.items)} Total: {o.totalAmount} Status: {o.status} Payment: {o.paymentStatus}
            <button onClick={() => handleEdit(o)}>Edit</button>
            {user?.role === "admin" && (
              <button onClick={() => handleDelete(o._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage; 