import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Chip, Avatar, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import { LocationOn, Phone, Email, Language, Business, Star } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/LoadingSkeleton'; // Assuming you have a LoadingSkeleton component

const SupplierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/suppliers/${id}`);
        setSupplier(data);
      } catch (err) {
        toast.error('Failed to fetch supplier details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id, api]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4 }}>
        <LoadingSkeleton />
      </Box>
    );
  }

  if (!supplier) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">Supplier not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4 }}>
      <Grid container spacing={3} maxWidth="lg" sx={{ mx: 'auto', px: 2 }}>
        {/* Left Column: Supplier Info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: