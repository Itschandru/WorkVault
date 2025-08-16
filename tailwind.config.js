/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], // scans your source files for classes
  darkMode: "class", // dark mode enabled via 'dark' class on the root element
  theme: {
    extend: {
      // Optional: add custom colors, fonts, animations here if needed
    },
  },
  plugins: [],
};

