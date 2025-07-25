import React from 'react';
import { Grid, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';

interface BusinessHoursInputProps {
  day: string;
  label: string;
  value: { open: string; close: string; closed: boolean };
  onChange: (day: string, field: string, value: any) => void;
}

const BusinessHoursInput: React.FC<BusinessHoursInputProps> = ({ day, label, value, onChange }) => {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
      <Grid item xs={3}>
        <Typography sx={{ textTransform: 'capitalize' }}>{label}</Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          type="time"
          label="Open"
          value={value.open}
          onChange={(e) => onChange(day, 'open', e.target.value)}
          disabled={value.closed}
          size="small"
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          type="time"
          label="Close"
          value={value.close}
          onChange={(e) => onChange(day, 'close', e.target.value)}
          disabled={value.closed}
          size="small"
        />
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={value.closed}
              onChange={(e) => onChange(day, 'closed', e.target.checked)}
            />
          }
          label="Closed"
        />
      </Grid>
    </Grid>
  );
};

export default BusinessHoursInput;