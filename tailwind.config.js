/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        mart: {
          dark: 'var(--color-mart-dark)',
          emerald: 'var(--color-mart-emerald)',
          stone: 'var(--color-mart-stone)',
          soft: 'var(--color-mart-soft)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
    },
  },
}
