/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#b82025',   // Logo Red
        secondary: '#f5c53a', // Logo Yellow
        dark: '#1a1a1a',      // Logo Black
        success: '#10b981',   
        danger: '#ef4444',    
      },
      backgroundImage: {
        // Logo background gradient
        'brand-gradient': 'linear-gradient(to bottom, #fdfaf5, #f2e2c9)',
      }
    },
  },
  plugins: [],
};