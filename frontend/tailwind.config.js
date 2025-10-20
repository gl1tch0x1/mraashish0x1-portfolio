/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0a0f18',
          DEFAULT: '#0a0f18',
        },
        secondary: {
          bg: '#101827',
          DEFAULT: '#101827',
        },
        accent: {
          DEFAULT: '#00ff9c',
          dark: '#00e68a',
        },
        text: {
          primary: '#cdd6f4',
          secondary: '#a6adc8',
        },
        border: {
          DEFAULT: '#313a50',
        },
      },
      fontFamily: {
        primary: ['Roboto', 'sans-serif'],
        secondary: ['Source Code Pro', 'monospace'],
        title: ['VT323', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

