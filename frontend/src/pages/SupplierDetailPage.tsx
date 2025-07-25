import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Paper, CircularProgress, Alert,
  Chip, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { useSupplier } from '../hooks/useSupplier.ts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Helmet } from 'react-helmet-async';

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
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error?.message || 'An error occurred while fetching supplier details.'}
        </Alert>
      </Container>
    );
  }

  if (!supplier) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Supplier not found.</Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${supplier.name} - Supplier Details`}</title>
        <meta name="description" content={`Detailed profile for ${supplier.name}, a supplier in the ${supplier.category} category located in ${supplier.city}.`} />
      </Helmet>
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={supplier.logo || '/default-logo.png'}
                  alt={`${supplier.name} logo`}
                  sx={{ width: 150, height: 150, mx: 'auto', mb: 2, border: '2px solid', borderColor: 'primary.main' }}
                />
                <Typography variant="h4" component="h1" gutterBottom>
                  {supplier.name}
                </Typography>
                <Chip
                  icon={<CategoryIcon />}
                  label={supplier.category}
                  color="secondary"
                  sx={{ color: 'white' }}
                />
                {supplier.verified && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                  {supplier.description || 'No description provided.'}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h5" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Address" secondary={supplier.address} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Location" secondary={`${supplier.city}, ${supplier.county}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={<a href={`mailto:${supplier.email}`}>{supplier.email}</a>} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={<a href={`tel:${supplier.phone}`}>{supplier.phone}</a>} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default SupplierDetailPage;