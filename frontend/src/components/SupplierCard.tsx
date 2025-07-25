import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Button, Chip, CardActions, IconButton, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Supplier } from '../types';
import { Link as RouterLink } from 'react-router-dom';

interface SupplierCardProps {
  supplier: Supplier;
  onFavorite: (id: string) => void;
  isFavorited: boolean;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onFavorite, isFavorited }) => {
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
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={logo || 'https://via.placeholder.com/300x180.png?text=No+Logo'}
          alt={`${name} logo`}
        />
        <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            onClick={() => onFavorite(_id)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
            }}
          >
            {isFavorited ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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