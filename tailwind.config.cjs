/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'orange': {
          '50': '#FCF8EC',
          '100': '#FBF4F1',
          '200': '#F7C3A0',
          '300': '#EF9456',
          '500': '#EA6A12',
          '600': '#CF6318',
        },
        'blue': {
          '300': '#07143B'
        },
        'red': {
          '500': '#DA242C',
          '600': '#D01820',
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}