/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode via class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        // Dark Mode Palette
        dark: {
          900: '#0B0F19', // Deepest background
          800: '#111827', // Lighter bg, cards
          700: '#1F2937', // Borders, inputs
          600: '#374151', // Hover states
          100: '#F9FAFB', // Text primary
          50:  '#9CA3AF', // Text secondary
        },
        // Accent Colors
        primary: {
          DEFAULT: '#06B6D4', // Bright Cyan
          light: '#22D3EE',
          dark: '#0891B2',
        },
        secondary: {
          DEFAULT: '#EC4899', // Magenta
          light: '#F472B6',
          dark: '#DB2777',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      // Animation for glowing effects
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 1, textShadow: '0 0 10px #06B6D4, 0 0 20px #06B6D4' },
          '50%': { opacity: 0.8, textShadow: '0 0 20px #06B6D4, 0 0 40px #06B6D4' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px 0px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(6, 182, 212, 0.7)' },
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}