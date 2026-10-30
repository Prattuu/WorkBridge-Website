/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#C2D6FF',
          300: '#94BAFF',
          400: '#5E93FF',
          500: '#346DFE',
          600: '#1E4BEB',
          700: '#1736CC',
          800: '#1E3A8A', // Target Royal Navy Blue Brand Color
          900: '#14255C',
          950: '#0C163B',
        },
        escrow: {
          created: '#3B82F6',
          held: '#F59E0B',
          released: '#10B981',
          refunded: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
