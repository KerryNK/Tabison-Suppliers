import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { ExpandMore, Search, Help } from '@mui/icons-material';
import { useApi } from '../api/client';
import { FAQ } from '../types';

const FAQPage: React.FC = () => {
  const api = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: faqsData, isLoading, error } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => api.getFAQs(),
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'payments', label: 'Payments' },
    { value: 'account', label: 'Account' },
    { value: 'products', label: 'Products' },
    { value: 'general', label: 'General' },
  ];

  const filteredFAQs = faqsData?.faqs?.filter((faq: FAQ) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load FAQs. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to common questions about our products, services, and policies
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box mb={3}>
        <Typography variant="body2" color="text.secondary">
          {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* FAQs */}
      {filteredFAQs.length > 0 ? (
        <Box>
          {filteredFAQs.map((faq: FAQ) => (
            <Accordion key={faq._id} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {faq.question}
                  </Typography>
                  <Chip
                    label={faq.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {faq.answer}
                </Typography>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(faq.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Help sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No FAQs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or category filter
          </Typography>
        </Paper>
      )}

      {/* Contact Support */}
      <Paper sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Can't find what you're looking for? Our support team is here to help.
        </Typography>
        <Typography variant="body2">
          Contact us at support@tabisonsuppliers.com or call +254 XXX XXX XXX
        </Typography>
      </Paper>
    </Container>
  );
};

export default FAQPage;
