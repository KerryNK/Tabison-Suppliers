import React from 'react';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useWallet } from '../hooks/useWallet';

const WalletConnector: React.FC = () => {
  const { account, error, isLoading, connectWallet, disconnectWallet } = useWallet();

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>Wallet Connection</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {account ? (
        <Box>
          <Typography sx={{ mb: 1, fontSize: '0.9rem' }}>Connected Account:</Typography>
          <Typography sx={{ mb: 2, wordBreak: 'break-all' }} color="primary">
            {account}
          </Typography>
          <Button variant="outlined" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </Box>
      ) : (
        <Button 
          variant="contained" 
          onClick={connectWallet}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </Box>
  );
};

export default WalletConnector;