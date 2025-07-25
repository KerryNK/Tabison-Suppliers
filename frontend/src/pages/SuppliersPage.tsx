import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import toast from 'react-hot-toast';
// Mock data for suppliers
const mockSuppliers = [
  {
    id: '1',
    name: 'Kenya Defense Solutions',
    category: 'Military Footwear',
    location: 'Nairobi, Kenya',
    phone: '+254 700 123 456',
    email: 'info@kenyadefense.co.ke',
    rating: 4.8,
    reviewCount: 45,
    verified: true,
    description: 'Leading supplier of high-quality military boots and tactical footwear. Serving the Kenya Defense Forces and security agencies for over 15 years.',
    specialties: ['Combat Boots', 'Tactical Shoes', 'Safety Boots', 'Custom Orders']
  },
  {
    id: '2',
    name: 'SafeStep Industries',
    category: 'Safety Footwear',
    location: 'Mombasa, Kenya',
    phone: '+254 700 234 567',
    email: 'orders@safestep.co.ke',
    rating: 4.6,
    reviewCount: 32,
    verified: true,
    description: 'Specialized in industrial safety footwear and protective equipment. ISO certified with international quality standards.',
    specialties: ['Steel Toe Boots', 'Anti-Slip Shoes', 'Chemical Resistant', 'Electrical Safety']
  },
  {
    id: '3',
    name: 'Official Wear Kenya',
    category: 'Official Footwear',
    location: 'Kisumu, Kenya',
    phone: '+254 700 345 678',
    email: 'sales@officialwear.co.ke',
    rating: 4.4,
    reviewCount: 28,
    verified: false,
    description: 'Premium supplier of formal and official footwear for government institutions, corporate offices, and professional environments.',
    specialties: ['Dress Shoes', 'Formal Boots', 'Corporate Footwear', 'Uniform Shoes']
  },
  {
    id: '4',
    name: 'Elite Security Gear',
    category: 'Security Footwear',
    location: 'Nakuru, Kenya',
    phone: '+254 700 456 789',
    email: 'contact@elitesecurity.co.ke',
    rating: 4.7,
    reviewCount: 38,
    verified: true,
    description: 'Trusted supplier of security and law enforcement footwear. Serving police, security companies, and private security firms.',
    specialties: ['Police Boots', 'Security Shoes', 'Patrol Footwear', 'Riot Gear']
  },
  {
    id: '5',
    name: 'Durable Footwear Co.',
    category: 'Industrial Footwear',
    location: 'Eldoret, Kenya',
    phone: '+254 700 567 890',
    email: 'info@durablefootwear.co.ke',
    rating: 4.3,
    reviewCount: 22,
    verified: true,
    description: 'Manufacturing and supplying durable industrial footwear for construction, mining, and heavy industry sectors.',
    specialties: ['Work Boots', 'Mining Shoes', 'Construction Footwear', 'Heavy Duty']
  },
  {
    id: '6',
    name: 'Professional Footwear Ltd',
    category: 'Professional Footwear',
    location: 'Thika, Kenya',
    phone: '+254 700 678 901',
    email: 'orders@professionalfootwear.co.ke',
    rating: 4.5,
    reviewCount: 35,
    verified: false,
    description: 'Comprehensive range of professional footwear for various industries including healthcare, hospitality, and service sectors.',
    specialties: ['Medical Shoes', 'Chef Boots', 'Service Footwear', 'Slip Resistant']
  }
];

const categories = ['All Categories', 'Military Footwear', 'Safety Footwear', 'Official Footwear', 'Security Footwear', 'Industrial Footwear', 'Professional Footwear'];
const locations = ['All Locations', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [favorites, setFavorites] = useState<string[]>([]);
  const api = useApi();

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    }
  }

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (selectedLocation !== 'All Locations') params.append('location', selectedLocation);

      const { data } = await api.get(`/suppliers/search?${params.toString()}`);
      setSuppliers(data.suppliers);
    } catch (err) {
      toast.error('Failed to fetch suppliers.');
    } finally {
      setLoading(false);
    }
  }, [api, searchTerm, selectedCategory, selectedLocation]);

  // Use debounced fetch for search term
  useEffect(() => {
    const debouncedFetch = debounce(fetchSuppliers, 500);
    debouncedFetch();
  }, [searchTerm, selectedCategory, selectedLocation, fetchSuppliers]);

  const handleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites!');
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              color: 'primary.main', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Verified Suppliers
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary', 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Connect with trusted suppliers for military, safety, and official footwear solutions
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ 
          bgcolor: 'white', 
          p: 3, 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          mb: 4 
        }}>
          <Grid container spacing={3} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search suppliers, specialties, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#4fd1c5' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#4fd1c5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4fd1c5',
                    },
                  },
                }}
              />
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations') && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedCategory !== 'All Categories' && (
                <Chip
                  label={`Category: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('All Categories')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedLocation !== 'All Locations' && (
                <Chip
                  label={`Location: ${selectedLocation}`}
                  onDelete={() => setSelectedLocation('All Locations')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>

        {/* Results Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} found
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#4fd1c5',
              '&:hover': { bgcolor: '#38b2ac' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Register as Supplier
          </Button>
        </Box>

        {/* Suppliers Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : suppliers.length > 0 ? (
          <Grid container spacing={3}>
            {suppliers.map((supplier) => (
              <Grid item xs={12} sm={6} lg={4} key={supplier.id}>
                <Fade in timeout={300}>
                  <Box>
                    <SupplierCard
                      supplier={supplier}
                      onFavorite={handleFavorite}
                      isFavorited={favorites.includes(supplier.id)}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <Business sx={{ fontSize: 80, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>
              No suppliers found
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Try adjusting your search criteria or filters
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedLocation('All Locations');
              }}
              sx={{ borderRadius: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SuppliersPage />
    </>
  )
}

export default AppWrapper;