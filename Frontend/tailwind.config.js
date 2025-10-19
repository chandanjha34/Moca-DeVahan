/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        'primary-light': '#1E293B',
        gold: '#FFD700',
        'gold-light': '#FFDC33',
        metallic: '#94A3B8',
        'neon-blue': '#00c6ff',
        'neon-green': '#00FF7F',
        warning: '#FF4500',
        'warning-orange': '#FF8C00'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [],
};