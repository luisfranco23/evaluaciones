/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // secound: "#1e375a",
        // primary: "#00abe4"
        primary: "#fff",
        secound: "#000",
        threeth: "#2563eb"
      }
    },
  },
  plugins: [],
}

