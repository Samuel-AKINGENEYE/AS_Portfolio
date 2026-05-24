/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#E8703A',
          hover: '#D4612C',
          muted: 'rgba(232, 112, 58, 0.12)',
        },
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
        'slide-up-d2': 'slideUp 0.7s ease-out 0.22s both',
        'slide-up-d3': 'slideUp 0.7s ease-out 0.34s both',
        'slide-up-d4': 'slideUp 0.7s ease-out 0.46s both',
        'slide-up-d5': 'slideUp 0.7s ease-out 0.58s both',
        'slide-right': 'slideRight 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both',
        'float': 'float 3.5s ease-in-out infinite',
        'float-opposite': 'floatOpposite 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
        'blink': 'blink 0.8s step-end infinite',
        'spin-slow': 'spin 4s linear infinite',
        'gradient': 'gradientShift 9s ease infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'dot-bounce': 'dotBounce 1.2s ease-in-out infinite',
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
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
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
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
};
