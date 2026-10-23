/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070E1A',
          900: '#0B1B33',
          850: '#0E213D',
          800: '#132B4F',
          700: '#1D3B68',
          600: '#2A518B',
          100: '#E6EDF7',
          50: '#F0F5FA',
        },
        gold: {
          700: '#9B7816',
          600: '#B88E1F',
          500: '#C59B27',
          400: '#D9B23E',
          300: '#E8CA6D',
          200: '#F3E2A3',
          100: '#FAF3DA',
          50: '#FDFBF3',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EBE5D8',
        },
        slate: {
          850: '#151F30',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(11, 27, 51, 0.08), 0 4px 6px -2px rgba(11, 27, 51, 0.04)',
        'luxury-hover': '0 20px 35px -5px rgba(11, 27, 51, 0.12), 0 8px 12px -3px rgba(11, 27, 51, 0.06)',
        'gold-glow': '0 0 25px -3px rgba(197, 155, 39, 0.35)',
      }
    },
  },
  plugins: [],
}
