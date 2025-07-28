"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Rating,
} from "@mui/material"
import { Search, LocationOn, Verified } from "@mui/icons-material"
import { useQuery } from "@tanstack/react-query"
import { useApi } from "../api/client"

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const api = useApi()

  const { data: suppliersData, isLoading } = useQuery({
    queryKey: ["suppliers", { q: searchTerm, category, location }],
    queryFn: () => api.getSuppliers({ category, location }),
  })

  const suppliers = suppliersData?.data?.suppliers || []

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Military Footwear", label: "Military Footwear" },
    { value: "Safety Footwear", label: "Safety Footwear" },
    { value: "Official Footwear", label: "Official Footwear" },
  ]

  const locations = [
    { value: "", label: "All Locations" },
    { value: "Nairobi", label: "Nairobi" },
    { value: "Mombasa", label: "Mombasa" },
    { value: "Kisumu", label: "Kisumu" },
    { value: "Nakuru", label: "Nakuru" },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Verified Suppliers
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Connect with trusted suppliers for military, safety, and official footwear solutions
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select value={location} label="Location" onChange={(e) => setLocation(e.target.value)}>
                {locations.map((loc) => (
                  <MenuItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Suppliers Grid */}
      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>Loading suppliers...</Typography>
        </Box>
      ) : suppliers.length > 0 ? (
        <Grid container spacing={3}>
          {suppliers.map((supplier: any) => (
            <Grid item xs={12} sm={6} md={4} key={supplier._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Chip label={supplier.category} color="primary" size="small" />
                    {supplier.verified && <Verified color="primary" />}
                  </Box>

                  <Typography gutterBottom variant="h6" component="h3">
                    {supplier.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {supplier.city}, {supplier.county}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {supplier.description}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating value={supplier.rating || 0} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({supplier.reviewCount || 0} reviews)
                    </Typography>
                  </Box>

                  <Button variant="contained" fullWidth>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No suppliers found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria or browse all categories
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default SuppliersPage
