module.exports = {
  content: ['./src/pages/**/*.{ts,tsx,html}'],
  safelist: [
    {
      pattern: /grid-cols-*/,
    },
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
