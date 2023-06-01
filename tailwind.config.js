const colors = require("tailwindcss/colors");

module.exports = {
  content: ["node_modules/tailvue/dist/tailvue.es.js"],
  theme: {
    colors: {
      inherit: colors.inherit,
      current: colors.currentColor,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      red: colors.red,
      orange: colors.orange,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: {
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
        300: "#d8b4fe",
        400: "#c084fc",
        500: "#a855f7",
        600: "#9333ea",
        700: "#7e22ce",
        800: "hsl(var(--purple-800))",
        850: "hsl(var(--purple-850))",
        900: "hsl(var(--purple-900))",
        950: "hsl(var(--purple-950))",
      },
    },
  },
};
