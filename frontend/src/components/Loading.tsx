import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
    }}
  >
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>Loading page...</Typography>
  </Box>
);

export default Loading;