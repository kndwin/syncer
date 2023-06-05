// tailwind config is required for editor support

const { fontFamily } = require("tailwindcss/defaultTheme");
const sharedConfig = require("tailwind-config/tailwind.config.js");

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "./index.html",
  ],
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  presets: [sharedConfig],
};
