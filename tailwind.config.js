/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-blue': '#121A35',
        'highlight1': '#19294A',
        'highlight2': '#3F4765',
        'green-light': '#75F591',
        'green-dark': '#21DA49',
        'purple-light': '#AC62E6',
        'purple-dark': '#9755CB'
      },
      backgroundImage: {
        'hero-pattern': "url('/bg-pattern.svg')",
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}
