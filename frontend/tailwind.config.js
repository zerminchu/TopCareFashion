/** @type {import('tailwindcss').Config} */

import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [aspectRatio],
}

