import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a2233', // deep blue
    },
    secondary: {
      main: '#4fd1c5', // teal
    },
    background: {
      default: '#f9f9f9',
      paper: '#fff',
    },
    warning: {
      main: '#ffb300', // accent yellow/orange
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
