/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zvioleta: "#80006A",
        znaranja: "#FF5F3F",
        zvioletaopaco: "#A65C99",
        znaranjaclaro: "#FFB5A6",
        zcinza: "#D7D7D7",
        zamarilloclaro: "#FFFABF",
        zamarillo: "#FFF280",
        zverdeclaro: "#45E3C9",
        zverde: "#00B094"
      }
    },
  },
  plugins: [],
}

