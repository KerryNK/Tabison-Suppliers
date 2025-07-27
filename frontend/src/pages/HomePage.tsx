import * as React from 'react';
import { Box, Typography, Container, Grid, Paper, Button, Icon } from '@mui/material';
import { VerifiedUser, ShoppingCart, HeadsetMic, Search, HowToReg, GroupAdd } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

import HeroSection from '../components/HeroSection';
import SupplierCard from '../components/SupplierCard';
import { useApi } from '../api/client';
import { Supplier } from '../types';
import toast from 'react-hot-toast';

const WhyChooseUs = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h4" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
        Why Choose Us?
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
            <Icon component={VerifiedUser} sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Verified Suppliers</Typography>
            <Typography color="text.secondary">
              Access a curated network of vetted and reliable suppliers, ensuring quality and trust.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
            <Icon component={ShoppingCart} sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Seamless Ordering</Typography>
            <Typography color="text.secondary">
              Our platform simplifies the procurement process from search to delivery.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'transparent' }}>
            <Icon component={HeadsetMic} sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Expert Support</Typography>
            <Typography color="text.secondary">
              Our team is here to assist you at every step, ensuring a smooth experience.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const HowItWorks = () => (
  <Box sx={{ py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
        How It Works
      </Typography>
      <Grid container spacing={4} textAlign="center">
        <Grid item xs={12} md={4}>
          <Icon component={Search} sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>1. Search & Filter</Typography>
          <Typography color="text.secondary">
            Easily find the right suppliers using our powerful search and filtering tools.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Icon component={GroupAdd} sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>2. Connect & Order</Typography>
          <Typography color="text.secondary">
            Connect directly with suppliers, request quotes, and place orders seamlessly.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Icon component={HowToReg} sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>3. Grow Your Business</Typography>
          <Typography color="text.secondary">
            Build strong partnerships and streamline your supply chain for business growth.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const CtaSection = () => (
  <Box sx={{ py: 8, bgcolor: 'primary.dark', color: 'white' }}>
    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Ready to Get Started?
      </Typography>
      <Typography sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
        Join our network today to find reliable partners or to showcase your products to a wider audience.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#4fd1c5',
            color: '#1a202c',
            fontWeight: 600,
            '&:hover': { bgcolor: '#38b2ac' },
          }}
        >
          Register as a Supplier
        </Button>
        <Button
          component={RouterLink}
          to="/products"
          variant="outlined"
          size="large"
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Browse Products
        </Button>
      </Box>
    </Container>
  </Box>
);

const HomePage: React.FC = () => {
  const [featuredSuppliers, setFeaturedSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchFeaturedSuppliers = async () => {
      try {
        // Fetch a limited number of suppliers for the homepage
        const { data } = await api.get('/suppliers?limit=6');
        setFeaturedSuppliers(data.suppliers);
      } catch (err) {
        toast.error('Could not load featured suppliers.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSuppliers();
  }, [api]);

  return (
    <Box>
      <HeroSection />
      <WhyChooseUs />

      {/* Featured Suppliers Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
            Featured Suppliers
          </Typography>
          {loading ? (
            <Typography textAlign="center">Loading suppliers...</Typography>
          ) : (
            <Grid container spacing={4}>
              {featuredSuppliers.map((supplier) => (
                <Grid item xs={12} sm={6} md={4} key={supplier._id}>
                  <SupplierCard supplier={supplier} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <HowItWorks />
      <CtaSection />
    </Box>
  );
};

export default HomePage;