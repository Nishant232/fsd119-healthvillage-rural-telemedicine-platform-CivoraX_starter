/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B9AAA",
        primaryDark: "#16808D",
        navy: "#142C52",
        textDark: "#071426",
        bg: "#F4F7FA",
        surface: "#FFFFFF"
      }
    }
  },
  plugins: []
};
