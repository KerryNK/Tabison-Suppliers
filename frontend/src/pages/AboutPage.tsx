import { useState } from 'react';
import { Box, Typography, Paper, Avatar, Grid } from '@mui/material';

const team = [
  { name: 'Jane Doe', role: 'Founder & CEO' },
  { name: 'John Smith', role: 'Operations Manager' },
  { name: 'Alice Johnson', role: 'Customer Success' },
];

const AboutPage: React.FC = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 3 }}>
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>About Tabison Suppliers</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Tabison Suppliers is dedicated to delivering quality supplies with speed and reliability. Our mission is to empower businesses and individuals by providing access to the best products in the market, delivered tomorrow, today.
      </Typography>
      <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>Our Mission</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        To be the most trusted supplier, known for exceptional service and innovative logistics.
      </Typography>
      <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>Our Vision</Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        To connect businesses and communities with the supplies they need, when they need them.
      </Typography>
      <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>Our Team</Typography>
      <Grid container spacing={3}>
        {team.map(member => (
          <Grid item xs={12} sm={4} key={member.name}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 64, height: 64, mb: 1 }}>{member.name[0]}</Avatar>
              <Typography fontWeight={700}>{member.name}</Typography>
              <Typography variant="body2" color="text.secondary">{member.role}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Box>
);

export default AboutPage; 