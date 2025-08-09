import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#1D6D73',
        'brand-teal-dark': '#14504f',
        'brand-white': '#FFFFFF',
        'brand-gray-light': '#dcdcdc',
        'brand-gray-bg': '#f4f4f4',
        'brand-black': '#000000',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
