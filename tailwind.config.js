/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        mart: {
          dark: '#0A1A1A',     // Replace with your actual hex
          emerald: '#10B981',  // Replace with your actual hex
          stone: '#F5F5F4',    // Replace with your actual hex
          soft: '#E7E5E4',     // Replace with your actual hex
        },
      },
      fontFamily: {
        display: ['YourDisplayFont', 'serif'],
        sans: ['YourSansFont', 'sans-serif'],
      },
    },
  },
}
