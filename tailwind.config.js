/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryOrange: "#fb8c00",
        secondaryOrange: "#ffe0b2",
      },
    },
  },
  plugins: [],
};
