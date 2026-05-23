/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#534AB7',
          light: '#EEEDFE',
          dark: '#3C3489',
        },
      },
    },
  },
  plugins: [],
};