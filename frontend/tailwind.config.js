/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3B82F6',
          cyan: '#22D3EE',
          dark: '#0F172A',
          card: '#1E293B',
          light: '#F8FAFC',
          accent: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.7s ease-out both',
        'slide-up-d1': 'slideUp 0.7s ease-out 0.1s both',
        'slide-up-d2': 'slideUp 0.7s ease-out 0.25s both',
        'slide-up-d3': 'slideUp 0.7s ease-out 0.4s both',
        'float': 'float 3.5s ease-in-out infinite',
        'float-opposite': 'floatOpposite 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
        'blink': 'blink 0.8s step-end infinite',
        'spin-slow': 'spin 4s linear infinite',
        'gradient': 'gradientShift 9s ease infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatOpposite: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(14px)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(37,211,102,0.7)' },
          '70%': { transform: 'scale(1.06)', boxShadow: '0 0 0 14px rgba(37,211,102,0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
};
