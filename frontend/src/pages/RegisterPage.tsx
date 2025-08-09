"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt:", formData)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Account Type"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="user">Customer</MenuItem>
              <MenuItem value="supplier">Supplier</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mb: 2 }}>
            Register
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login">
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default RegisterPage
