/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./template/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          blue: "#3B82F6",
          green: "#10B981",
          purple: "#8B5CF6",
          red: "#EF4444",
          yellow: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
