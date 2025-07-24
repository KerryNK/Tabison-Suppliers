import React from 'react';
import { Container, Typography, Grid, Alert } from '@mui/material';
import { useSuppliers } from '../hooks/useSuppliers';
import SupplierCard from './SupplierCard';
import SupplierCardSkeleton from './SupplierCardSkeleton';
import { Supplier } from '../types';

const FeaturedSuppliers: React.FC = () => {
  const { data: suppliers, isLoading, isError, error } = useSuppliers();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={4}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <SupplierCardSkeleton />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (isError) {
      return <Alert severity="error">Could not load suppliers: {error.message}</Alert>;
    }

    if (!suppliers || suppliers.length === 0) {
      return <Typography>No suppliers found.</Typography>;
    }

    return (
      <Grid container spacing={4}>
        {suppliers.map((supplier: Supplier) => (
          <Grid item key={supplier._id} xs={12} sm={6} md={4}>
            <SupplierCard supplier={supplier} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }} maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}>
        Featured Suppliers
      </Typography>
      {renderContent()}
    </Container>
  );
};

export default FeaturedSuppliers;