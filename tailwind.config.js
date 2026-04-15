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
          50: '#eef3f9',
          100: '#dbe6f2',
          200: '#b7cbe1',
          300: '#8ea9ca',
          400: '#5e7faa',
          500: '#1a3d73',
          600: '#163562',
          700: '#122a4d',
          800: '#0d1f39',
        },
        secondary: {
          100: '#dde8f6',
          200: '#c3d5ec',
          300: '#9eb8dc',
          400: '#6f90be',
          500: '#4d71a2',
        },
        dark: '#0a1628',
        light: '#f3f7fc',
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
