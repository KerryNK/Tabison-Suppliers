import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    q: 'How fast is delivery?',
    a: 'Most orders are delivered within 24 hours in major cities. Rural areas may take 2-3 days.'
  },
  {
    q: 'Can I order in bulk?',
    a: 'Yes! We offer special pricing and logistics for bulk orders. Contact us for a custom quote.'
  },
  {
    q: 'What is your return policy?',
    a: 'Returns are accepted within 14 days for unused items in original packaging.'
  },
  {
    q: 'How do I track my order?',
    a: 'You will receive a tracking link via email after your order is shipped.'
  },
  {
    q: 'Do you offer customer support?',
    a: 'Yes, our support team is available 7 days a week via phone, email, or chat.'
  }
];

const FAQPage: React.FC = () => (
  <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 3 }}>
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>Frequently Asked Questions</Typography>
      {faqs.map((faq, idx) => (
        <Accordion key={idx} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{faq.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  </Box>
);

export default FAQPage;
