/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5ff',
          300: '#a8bfff',
          400: '#89a9ff',
          500: '#6b92ff',
          600: '#5273f7',
          700: '#4259e8',
          800: '#3845d1',
          900: '#2f38b8',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #6b92ff 0%, #4259e8 100%)',
        'gradient-green': 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
        'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      },
    },
  },
  plugins: [],
}
