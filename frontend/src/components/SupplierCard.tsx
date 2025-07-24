import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Verified,
  Star,
  Favorite,
  FavoriteBorder,
  Business
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    category: string;
    location: string;
    phone: string;
    email: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    description: string;
    specialties: string[];
    image?: string;
  };
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ 
  supplier, 
  onFavorite, 
  isFavorited = false 
}) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with Avatar and Verification */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#4fd1c5',
              color: '#1a202c',
              fontWeight: 800,
              fontSize: '1.5rem',
              mr: 2
            }}
          >
            {supplier.image ? (
              <img src={supplier.image} alt={supplier.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              supplier.name.charAt(0).toUpperCase()
            )}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '1.1rem'
                }}
              >
                {supplier.name}
              </Typography>
              {supplier.verified && (
                <Tooltip title="Verified Supplier">
                  <Verified sx={{ color: '#4fd1c5', fontSize: 20 }} />
                </Tooltip>
              )}
            </Box>
            
            <Chip
              label={supplier.category}
              size="small"
              sx={{
                bgcolor: 'rgba(79, 209, 197, 0.1)',
                color: '#4fd1c5',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          </Box>
          
          <IconButton
            onClick={() => onFavorite?.(supplier.id)}
            sx={{ color: isFavorited ? '#e53e3e' : '#a0aec0' }}
          >
            {isFavorited ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating
            value={supplier.rating}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#ffd700'
              }
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {supplier.rating} ({supplier.reviewCount} reviews)
          </Typography>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {supplier.description}
        </Typography>

        {/* Specialties */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            Specialties:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {supplier.specialties.slice(0, 3).map((specialty, index) => (
              <Chip
                key={index}
                label={specialty}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  borderColor: '#e2e8f0',
                  color: 'text.secondary'
                }}
              />
            ))}
            {supplier.specialties.length > 3 && (
              <Chip
                label={`+${supplier.specialties.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  borderColor: '#e2e8f0',
                  color: 'text.secondary'
                }}
              />
            )}
          </Box>
        </Box>

        {/* Contact Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: '#4fd1c5' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {supplier.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone sx={{ fontSize: 16, color: '#4fd1c5' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {supplier.phone}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          component={Link}
          to={`/suppliers/${supplier.id}`}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#4fd1c5',
            color: 'white',
            fontWeight: 600,
            borderRadius: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#38b2ac',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default SupplierCard;
