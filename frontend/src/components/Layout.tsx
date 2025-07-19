import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Suppliers", path: "/suppliers" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/orders" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#1a2233", color: "#fff", padding: 24 }}>
        <h2 style={{ marginBottom: 32 }}>Tabison Suppliers</h2>
        <nav>
          {navItems.map((item) => (
            <div key={item.path} style={{ marginBottom: 16 }}>
              <Link
                to={item.path}
                style={{
                  color: location.pathname.startsWith(item.path) ? "#4fd1c5" : "#fff",
                  textDecoration: "none",
                  fontWeight: location.pathname.startsWith(item.path) ? 700 : 400,
                }}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 32 }}>
          {user ? (
            <>
              <div style={{ marginBottom: 8 }}>Logged in as <b>{user.username}</b> ({user.role})</div>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </aside>
      <main style={{ flex: 1, background: "#f8f9fa", padding: 32 }}>{children}</main>
    </div>
  );
};

export default Layout; 