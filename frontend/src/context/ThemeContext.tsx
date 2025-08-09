import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext({
  mode: 'light',
  toggle: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);


export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
    }
  }, [mode]);

  const toggle = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
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
