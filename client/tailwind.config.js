/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tena: {
          bg: '#080C14',
          surface: '#0F172A',
          card: '#131D31',
          border: '#1E293B',
          'border-light': '#334155',
          emerald: {
            DEFAULT: '#10B981',
            hover: '#059669',
            light: '#34D399',
            glow: 'rgba(16, 185, 129, 0.15)',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            hover: '#0891B2',
            glow: 'rgba(6, 182, 212, 0.15)',
          },
          muted: '#94A3B8',
          subtle: '#64748B',
          text: '#F8FAFC',
          danger: '#EF4444',
          warning: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
