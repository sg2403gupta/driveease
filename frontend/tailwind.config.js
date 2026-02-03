/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ===============================
           AJIO-INSPIRED SEMANTIC COLORS
        =============================== */

        /* App background */
        "bg-primary": {
          light: "#FFFFFF", // clean white
          dark: "#181818", // soft black (not pure)
        },

        /* Cards, navbar, surfaces */
        "bg-surface": {
          light: "#FFFFFF",
          dark: "#222222",
        },

        /* Page section background */
        "bg-muted": {
          light: "#F7F7F7",
          dark: "#2A2A2A",
        },

        /* Primary text */
        "text-primary": {
          light: "#2C2C2C", // AJIO-style charcoal
          dark: "#EDEDED",
        },

        /* Secondary / muted text */
        "text-muted": {
          light: "#7A7A7A",
          dark: "#A0A0A0",
        },

        /* Borders / dividers */
        border: {
          light: "#E5E5E5",
          dark: "#333333",
        },

        /* Accent / CTA (AJIO navy tone) */
        accent: {
          DEFAULT: "#1A237E",
          hover: "#2E3AA1",
        },

        /* Status colors */
        success: "#2E7D32",
        danger: "#D32F2F",
        warning: "#ED6C02",
      },

      fontFamily: {
        sans: [
          "Inter",
          "Helvetica Neue",
          "Arial",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },

      letterSpacing: {
        wide: "0.08em",
        wider: "0.12em",
      },

      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.04)",
        none: "none",
      },

      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};
