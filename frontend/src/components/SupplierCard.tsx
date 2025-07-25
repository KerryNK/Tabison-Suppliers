import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Button, Chip, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Supplier } from '../types';
import { Link as RouterLink } from 'react-router-dom';

interface SupplierCardProps {
  supplier: Supplier;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier }) => {
  const {
    _id,
    name,
    category,
    rating,
    city,
    county,
    logo,
    verified,
    reviewCount
  } = supplier;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="180"
        image={logo || 'https://via.placeholder.com/300x180.png?text=No+Logo'}
        alt={`${name} logo`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip label={category} color="secondary" size="small" sx={{ color: 'white' }} />
          {verified && <VerifiedIcon color="primary" fontSize="small" titleAccess="Verified Supplier" />}
        </Box>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">{city}, {county}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating value={rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviewCount || 0} reviews)
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/supplier/${_id}`}
          variant="contained"
          fullWidth
          color="primary"
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default SupplierCard;