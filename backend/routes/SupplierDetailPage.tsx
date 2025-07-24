import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Paper, CircularProgress, Alert,
  Chip, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { useSupplier } from '../hooks/useSupplier';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import VerifiedIcon from '@mui/icons-material/Verified';

const SupplierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: supplier, isLoading, isError, error } = useSupplier(id);

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container