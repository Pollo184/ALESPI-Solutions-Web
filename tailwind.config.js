/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
        },
        secondary: {
          400: '#00d4ff',
          500: '#00bfcc',
        },
        dark: '#1a1a2e',
        light: '#f5f7fa',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        slideUp: 'slideUp 0.8s ease-out',
        countUp: 'countUp 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(30px)' },
        },
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(50px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        countUp: {
          from: {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
