import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Valid email is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'center' }}>Contact Us</Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="message"
          label="Message"
          value={form.message}
          onChange={handleChange}
          error={!!errors.message}
          helperText={errors.message}
          fullWidth
          multiline
          minRows={4}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={submitting} sx={{ fontWeight: 700 }}>
          {submitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
      <Dialog open={success} onClose={() => setSuccess(false)}>
        <DialogTitle>Message Sent</DialogTitle>
        <DialogContent>
          <Alert severity="success">Thank you for contacting us! We will get back to you soon.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccess(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactPage; 