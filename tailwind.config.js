/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        gray: {
          light: 'var(--color-gray-light)',
          DEFAULT: 'var(--color-gray)',
          dark: 'var(--color-gray-dark)',
        }
      },
      boxShadow: {
        'toolbar': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'button': '0 5px 15px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
