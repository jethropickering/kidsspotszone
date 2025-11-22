/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5e7',
          100: '#fde8c4',
          200: '#fbd89c',
          300: '#f9c774',
          400: '#f7b956',
          500: '#f5ab38',
          600: '#f39c32',
          700: '#f08a2b',
          800: '#ee7924',
          900: '#eb5a17',
        },
        secondary: {
          50: '#e8f5f1',
          100: '#c6e6dc',
          200: '#a0d6c5',
          300: '#7ac6ae',
          400: '#5eb99c',
          500: '#42ad8b',
          600: '#3c9f83',
          700: '#338e78',
          800: '#2b7e6e',
          900: '#1d6159',
        },
        accent: {
          50: '#fef0f5',
          100: '#fdd9e6',
          200: '#fbb0d3',
          300: '#f987c0',
          400: '#f768b2',
          500: '#f549a4',
          600: '#f4429c',
          700: '#f23992',
          800: '#f03188',
          900: '#ee2176',
        },
        warm: {
          50: '#fffbf5',
          100: '#fff5e6',
          200: '#ffefd6',
          300: '#ffe8c6',
          400: '#ffe3ba',
          500: '#ffdeae',
          600: '#ffdaa7',
          700: '#ffd49d',
          800: '#ffcf94',
          900: '#ffc684',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fredoka', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
