/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          950: '#FAF7EE',
          900: '#E8E3D5', // Lighter Sand
          850: '#E4DDD0',
          800: '#E1DBC9', // Primary Sand
          700: '#D5CEBA', // Darker Sand
          600: '#C7BD9F',
        },
        charcoal: {
          950: '#262626',
          900: '#3C3C3C', // Primary Charcoal Text
          800: '#4A4A4A',
          700: '#5A5A5A', // Secondary Text
          600: '#686868',
          500: '#757575', // Muted Text
          400: '#949494',
        },
        pine: {
          900: '#1F3324',
          800: '#2D4530', // Primary Dark Pine Accent
          700: '#3A563E', // Pine Hover
          600: '#4A694E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'sand-gradient': 'linear-gradient(135deg, #E8E3D5 0%, #E1DBC9 50%, #D5CEBA 100%)',
        'card-sand-gradient': 'linear-gradient(145deg, rgba(232, 227, 213, 0.88), rgba(213, 206, 186, 0.92))',
        'block-sand-gradient': 'linear-gradient(150deg, #E8E3D5 0%, #E1DBC9 55%, #D5CEBA 100%)',
        'nav-sand-gradient': 'linear-gradient(180deg, rgba(232, 227, 213, 0.95) 0%, rgba(225, 219, 201, 0.90) 100%)',
      },
    },
  },
  plugins: [],
};
