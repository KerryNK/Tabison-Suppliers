// src/pages/AuthPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface AuthPageProps {
  mode: "login" | "register" | "forgot-password" | "reset-password";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.signInWithEmail(email, password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await auth.signUpWithEmail(email, password, displayName);
      toast.success("Registered successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.resetPassword(email);
      toast.success("Password reset email sent");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      {mode === "login" && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email:</label><br />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label><br />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{ marginTop: 10 }}>
            <a href="/register">Register</a> | <a href="/forgot-password">Forgot Password?</a>
          </p>
        </>
      )}

      {mode === "register" && (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label htmlFor="displayName">Display Name:</label><br />
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label><br />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label><br />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label><br />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p style={{ marginTop: 10 }}>
            <a href="/login">Login</a>
          </p>
        </>
      )}

      {mode === "forgot-password" && (
        <>
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <div>
              <label htmlFor="email">Email:</label><br />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
          <p style={{ marginTop: 10 }}>
            <a href="/login">Login</a>
          </p>
        </>
      )}

      {mode === "reset-password" && (
        <p>Reset password functionality is not implemented yet.</p>
      )}
    </div>
  );
};

export default AuthPage;
