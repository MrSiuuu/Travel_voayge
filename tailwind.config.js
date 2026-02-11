/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0a0a0f',
          card: '#12121a',
          border: '#1e1e2a',
          gold: '#c9a227',
          goldDim: '#9a7b1a',
          muted: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
