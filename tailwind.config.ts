import type { Config } from "tailwindcss";

// UNSTANDARD theme tokens — see docs/DESIGN.md
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand accent (mustard)
        unstandard: {
          DEFAULT: "#e9d45a",
          light: "#f6dc30",
        },
        // "LIFE IS COLORFUL" rainbow palette (used per area / category)
        rainbow: {
          red: "#ed1c24",
          coral: "#ea5c52",
          pink: "#e6b8c4",
          lime: "#c6d876",
          green: "#8cc63f",
          sky: "#b2d2de",
          cyan: "#a4d2de",
          blue: "#91c2e1",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-noto)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
