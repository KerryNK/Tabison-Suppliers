import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4fd1c5',
    },
    secondary: {
      main: '#1a2233',
    },
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme; 