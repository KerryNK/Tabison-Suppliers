import React from 'react';
import { Box, Typography, Paper, Grid, Avatar } from '@mui/material';

const testimonials = [
  {
    name: 'Emily R.',
    quote: 'Tabison Suppliers exceeded my expectations! Fast delivery and great customer service.',
    avatar: ''
  },
  {
    name: 'Michael T.',
    quote: 'The best supplier I have worked with. Highly recommend for bulk orders.',
    avatar: ''
  },
  {
    name: 'Sarah K.',
    quote: 'Easy ordering process and my products arrived the next day. Thank you Tabison!',
    avatar: ''
  },
  {
    name: 'David L.',
    quote: 'Excellent quality and reliable delivery. Will order again!',
    avatar: ''
  }
];

const TestimonialsPage: React.FC = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 3 }}>
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>What Our Clients Say</Typography>
      <Grid container spacing={3}>
        {testimonials.map((t, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Avatar sx={{ width: 56, height: 56, mb: 1 }}>{t.name[0]}</Avatar>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1, textAlign: 'center' }}>
                “{t.quote}”
              </Typography>
              <Typography variant="body2" color="text.secondary">{t.name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Box>
);

export default TestimonialsPage;
