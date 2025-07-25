import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import toast from 'react-hot-toast';

const categories = ['All Categories', 'Military Footwear', 'Safety Footwear', 'Official Footwear', 'Security Footwear', 'Industrial Footwear', 'Professional Footwear'];
const locations = ['All Locations', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];

/**
 * A utility function to delay execution of a function.
 * It's defined outside the component to avoid being recreated on every render.
 */
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return function(...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
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

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [favorites, setFavorites] = useState<string[]>([]);
  const api = useApi();
  
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Only add parameters if they have a value to avoid empty params
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
  }, [api, searchTerm, selectedCategory, selectedLocation]); // Dependencies are correct

  // Memoize the debounced version of the fetch function
  const debouncedFetchSuppliers = useCallback(
    debounce(fetchSuppliers, 500),
    [fetchSuppliers]
  );

  useEffect(() => {
    debouncedFetchSuppliers();
  }, [debouncedFetchSuppliers]);

  const handleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites!');
  };

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