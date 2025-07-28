import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { register as registerApi, login as loginApi } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerApi(username, email, password);
      // Auto-login after registration
      const { token, user } = await loginApi(email, password);
      login(user, token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading} sx={{ fontWeight: 700 }}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Button component={Link} to="/login" color="secondary" size="small">Login</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
