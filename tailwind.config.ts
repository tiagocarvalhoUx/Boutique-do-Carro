import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        brand: { DEFAULT: '#FFC400', dark: '#D89F00', light: '#FFD54A' },
        ink: { 950: '#090A0C', 900: '#121418', 800: '#1B1E24', 700: '#30343B' },
        fog: '#CDD1D6',
        success: '#20C56B',
        danger: '#E5484D',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: { 18: '4.5rem', 22: '5.5rem', 24: '6rem' },
      borderRadius: { card: '12px' },
      transitionDuration: { base: '200ms' },
      boxShadow: {
        glow: '0 0 60px -10px rgba(255, 196, 0, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config
