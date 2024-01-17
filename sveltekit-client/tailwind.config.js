

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{svelte, html, js, ts}',
  ],
  theme: {
    extend: {
      colors: {
        'beige': '#F8F7F4',
        'bgbrown': '#efede6',
        'strongpurple': '#8f71e7',
        'strongpink': '#e558fd',
        'darkblue': '#314867',
      },
      spacing: {
        '1/6': '16.666667%',
        '29.17%': '29.17%',
      }
    },
  },
  plugins: [
  ],
}

