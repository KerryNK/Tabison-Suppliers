import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../api/client';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const api = useApi();
  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSuccess(''); setError('');
    try {
      await api.put('/auth/profile', { name });
      setSuccess('Profile updated');
    } catch {
      setError('Failed to update profile');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Settings</Typography>
      <Box component="form" onSubmit={save}>
        <TextField fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
      </Box>
      {success && <Alert sx={{ mt: 2 }} severity="success">{success}</Alert>}
      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
    </Box>
  );
};

export default SettingsPage;


