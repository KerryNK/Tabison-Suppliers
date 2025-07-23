import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext({
  mode: 'light',
  toggle: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

const getStoredMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('themeMode') || 'light';
  }
  return 'light';
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState(getStoredMode());

  const toggle = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#1a237e' },
      secondary: { main: '#f50057' },
      background: {
        default: mode === 'light' ? '#f9f9f9' : '#181818',
        paper: mode === 'light' ? '#fff' : '#232323',
      },
    },
    shape: { borderRadius: 12 },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
