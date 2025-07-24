import { createTheme } from '@mui/material/styles';

// A modern, clean color palette
const palette = {
  primary: {
    main: '#2563eb', // A strong, modern blue
  },
  secondary: {
    main: '#059669', // A complementary green
  },
  background: {
    default: '#f8fafc', // A very light gray for the background
    paper: '#ffffff',   // White for cards and surfaces
  },
  text: {
    primary: '#1e293b', // Dark slate for primary text
    secondary: '#475569', // Lighter slate for secondary text
  },
};

const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Merriweather", "Georgia", serif', fontWeight: 700 },
    h2: { fontFamily: '"Merriweather", "Georgia", serif', fontWeight: 700 },
    h3: { fontFamily: '"Merriweather", "Georgia", serif', fontWeight: 700 },
    h4: { fontFamily: '"Merriweather", "Georgia", serif', fontWeight: 700 },
    h5: { fontFamily: '"Merriweather", "Georgia", serif', fontWeight: 700 },
    h6: { fontFamily: '"Merriweather", "Georgia", serif', fontWeight: 700 },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;