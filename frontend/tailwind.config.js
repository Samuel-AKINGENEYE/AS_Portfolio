/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
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
        'slide-up': 'slideUp 0.6s ease-out both',
        'slide-up-d1': 'slideUp 0.6s ease-out 0.1s both',
        'slide-up-d2': 'slideUp 0.6s ease-out 0.2s both',
        'slide-up-d3': 'slideUp 0.6s ease-out 0.3s both',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'blink': 'blink 0.75s step-end infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient': 'gradientShift 6s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 14px rgba(37, 211, 102, 0)' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'currentColor' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
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
