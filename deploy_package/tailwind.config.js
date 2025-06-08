/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00f5ff',
        'cyber-purple': '#bd00ff',
        'cyber-pink': '#ff0080',
        'cyber-green': '#00ff41',
        'cyber-yellow': '#ffee00',
        'gray': {
          900: '#0a0a1a',
          800: '#121225',
          700: '#1f1f3f',
          600: '#353568',
          500: '#5b5b8c',
          400: '#9b9bbb',
          300: '#c7c7e6',
          200: '#dcdcf4',
          100: '#eaeaff',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 245, 255, 0.6)',
        'glow-purple': '0 0 15px rgba(189, 0, 255, 0.6)',
        'glow-pink': '0 0 15px rgba(255, 0, 128, 0.6)',
        'glow-green': '0 0 15px rgba(0, 255, 65, 0.6)',
        'glow-sm': '0 0 10px rgba(0, 245, 255, 0.3)',
      },
      fontFamily: {
        sans: ['Rajdhani', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': "url('/cyber-grid.svg')",
        'cyber-gradient': "linear-gradient(to right, #00f5ff, #bd00ff, #ff0080)",
        'grid-pattern': "url(\"data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%2300f5ff' stroke-width='0.5' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e\")"
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spin-reverse 15s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(0, 245, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}