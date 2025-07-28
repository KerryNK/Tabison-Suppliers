"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Email, Phone, LocationOn } from "@mui/icons-material"
import { useApi } from "../api/client"
import toast from "react-hot-toast"

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  })
  const [loading, setLoading] = useState(false)
  const api = useApi()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.submitContact(formData)
      toast.success("Message sent successfully!")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Contact Us
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
        Get in touch with us for inquiries, orders, or partnership opportunities
      </Typography>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, height: "fit-content" }}>
            <Typography variant="h5" gutterBottom>
              Get in Touch
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Email sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body2" color="text.secondary">
                  info@tabisonsuppliers.com
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Phone sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body2" color="text.secondary">
                  +254 XXX XXX XXX
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOn sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nairobi, Kenya
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Send us a Message
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      label="Category"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <MenuItem value="general">General Inquiry</MenuItem>
                      <MenuItem value="products">Product Information</MenuItem>
                      <MenuItem value="orders">Orders & Pricing</MenuItem>
                      <MenuItem value="partnership">Partnership</MenuItem>
                      <MenuItem value="support">Support</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 120 }}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ContactPage
