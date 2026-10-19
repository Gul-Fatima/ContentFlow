const tokens = require('./src/lib/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Design tokens — single source of truth in src/lib/tokens.js.
      colors: { ...tokens.colors },
      fontSize: tokens.fontSize,
      borderRadius: tokens.borderRadius
    }
  }
};
