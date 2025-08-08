import React, { useEffect, useState } from 'react';
import { Box, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { useApi } from '../api/client';

type Delivery = { id: string; name: string; etaDays: number; price: number };

const DeliveryOptions: React.FC<{ value?: string; onChange?: (v: string) => void }> = ({ value, onChange }) => {
  const api = useApi();
  const [options, setOptions] = useState<Delivery[]>([]);
  useEffect(() => { api.get('/delivery').then((d) => setOptions(d.options)); }, [api]);
  return (
    <Box>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>Delivery Options</Typography>
      <RadioGroup value={value} onChange={(e) => onChange?.(e.target.value)}>
        {options.map(o => (
          <FormControlLabel key={o.id} value={o.id} control={<Radio />} label={`${o.name} • ETA ${o.etaDays}d • Ksh ${o.price}`} />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default DeliveryOptions;


