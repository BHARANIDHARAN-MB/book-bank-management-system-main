/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f3f0',
          100: '#e8e3db',
          200: '#d4cbbf',
          300: '#bfad9e',
          400: '#a8906e',
          500: '#8b6f47',
          600: '#6f5438',
          700: '#543d2a',
          800: '#3a291c',
          900: '#1e150e',
        },
        cream: '#faf7f2',
        parchment: '#f2ede3',
        forest: '#2d5016',
        gold: '#c8922a',
      },
      boxShadow: {
        'book': '4px 4px 0px #1e150e',
        'book-lg': '6px 6px 0px #1e150e',
        'inner-glow': 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: []
}
