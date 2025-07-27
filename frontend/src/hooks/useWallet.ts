import { useState, useEffect, useCallback } from 'react';

// Extend the Window interface to include ethereum for TypeScript support
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  account: string | null;
  error: string | null;
  isLoading: boolean;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    account: null,
    error: null,
    isLoading: false,
  });

  const disconnectWallet = useCallback(() => {
    setWallet({ account: null, error: null, isLoading: false });
  }, []);

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed. Please install it to connect your wallet.");
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWallet({ account: accounts[0], isLoading: false, error: null });
      } else {
        throw new Error("No accounts found. Please ensure your wallet is unlocked and configured.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred while connecting the wallet.";
      setWallet({ account: null, isLoading: false, error: errorMessage });
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) setWallet(prev => ({ ...prev, account: accounts[0] }));
        else disconnectWallet();
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, [disconnectWallet]);

  return { ...wallet, connectWallet, disconnectWallet };
};