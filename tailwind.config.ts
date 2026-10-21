import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta pastel del Lector de NIIF
        lavender: "#E6E6FA",
        mint: "#D8F3DC",
        peach: "#FFE5D9",
        sky: "#D0E8F2",
        cream: "#FFFBF5",
        ink: "#374151",
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      maxWidth: {
        prose: "72ch",
      },
    },
  },
  plugins: [],
};

export default config;
