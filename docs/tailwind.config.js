/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pb_hooks/pages/**/*.{ejs,md}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['aqua'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
