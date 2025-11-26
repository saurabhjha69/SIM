/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#4f000b",
        damaranth: "#720026",
        amaranth: "#ce4257",
        coral: "#ff7f51",
        sand: "#ff9b54",
      },
      backgroundImage: {
        gradientApp:
          "linear-gradient(135deg, #4f000b, #720026, #ce4257, #ff7f51, #ff9b54)",
      },
    },
  },
  plugins: [],
};
