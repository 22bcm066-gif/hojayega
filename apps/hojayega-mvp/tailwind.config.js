/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6B00',
          50: '#FFF3EA',
          100: '#FFE4D0',
          200: '#FFC79E',
          300: '#FFA966',
          400: '#FF8C42',
          500: '#FF6B00',
          600: '#E85F00',
          700: '#C24F00',
          800: '#8F3A00',
          900: '#5C2500',
        },
        cream: '#FFF8F3',
      },
      fontFamily: {
        display: ['"Sora"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(255, 107, 0, 0.12), 0 2px 8px -2px rgba(17, 12, 8, 0.06)',
        card: '0 8px 30px -8px rgba(17, 12, 8, 0.10)',
        'card-hover': '0 20px 40px -12px rgba(255, 107, 0, 0.22)',
        glow: '0 0 0 1px rgba(255,107,0,0.08), 0 12px 32px -8px rgba(255,107,0,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%)',
        'brand-radial': 'radial-gradient(120% 120% at 100% 0%, #FFE4D0 0%, #FFF8F3 55%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20px,-30px) scale(1.05)' },
          '66%': { transform: 'translate(-15px,15px) scale(0.97)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        blob: 'blob 10s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
