/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand palette — anchored on forest green #1D4533.
        // Change these values to re-theme the entire app (native + web).
        brand: {
          50: '#F7EAE0', // cream
          100: '#F1E1D2', // warm light
          200: '#EBD2BB', // warm
          300: '#D8B196', // tan
          400: '#B98A6E', // warm tan
          500: '#5E7C66', // sage green
          600: '#1D4533', // forest green (primary)
          700: '#173A2B',
          800: '#122E22',
          900: '#0D241B',
          950: '#081A12'
        },
        // Theme accents: cream = page background, peach = highlight,
        // brown = headings / dark text.
        cream: '#F7EAE0',
        peach: '#F9D2BA',
        brown: '#5E3122'
      }
    }
  }
};
