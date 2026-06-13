/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-outfit)', '"Outfit"', 'sans-serif'],
      },
      colors: {
        'logo-red': '#9B2E33',
        'logo-red-light': '#C45B62',
        'logo-red-dark': '#7A1E22',
        'logo-red-glow': 'rgba(155,46,51,0.2)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
