import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material';
import { useApi } from '../api/client';

type Item = { product: string; quantity: number };

const BulkQuoteForm: React.FC<{ defaultProductId?: string }> = ({ defaultProductId }) => {
  const api = useApi();
  const [items, setItems] = useState<Item[]>(defaultProductId ? [{ product: defaultProductId, quantity: 1 }] : []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const addRow = () => setItems([...items, { product: '', quantity: 1 }]);
  const updateRow = (idx: number, field: keyof Item, value: string | number) => {
    setItems(items.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  };
  const removeRow = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSuccess(''); setError('');
    try {
      await api.post('/quotes', { items, name, email, phone, notes });
      setSuccess('Quote request submitted. We will contact you shortly.');
      setItems(defaultProductId ? [{ product: defaultProductId, quantity: 1 }] : []);
      setName(''); setEmail(''); setPhone(''); setNotes('');
    } catch {
      setError('Failed to submit quote request');
    }
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Request Bulk Quote</Typography>
      <Stack spacing={2}>
        {items.map((it, idx) => (
          <Stack direction="row" spacing={1} key={idx}>
            <TextField size="small" fullWidth label="Product ID" value={it.product} onChange={e => updateRow(idx, 'product', e.target.value)} />
            <TextField size="small" sx={{ width: 120 }} type="number" label="Qty" value={it.quantity} onChange={e => updateRow(idx, 'quantity', Number(e.target.value))} />
            <Button color="error" onClick={() => removeRow(idx)}>Remove</Button>
          </Stack>
        ))}
        <Button onClick={addRow}>Add Item</Button>
        <TextField size="small" label="Your Name" value={name} onChange={e => setName(e.target.value)} />
        <TextField size="small" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField size="small" label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <TextField size="small" label="Notes" multiline minRows={2} value={notes} onChange={e => setNotes(e.target.value)} />
        <Button type="submit" variant="contained">Submit</Button>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
};

export default BulkQuoteForm;


