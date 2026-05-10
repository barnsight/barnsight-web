/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.ejs", "./public/**/*.js"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Atkinson Hyperlegible",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Fraunces",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        "ink-mute": "rgb(var(--ink-mute) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-soft": "rgb(var(--paper-soft) / <alpha-value>)",
        "paper-warm": "rgb(var(--paper-warm) / <alpha-value>)",
        hay: "rgb(var(--hay) / <alpha-value>)",
        "hay-soft": "rgb(var(--hay-soft) / <alpha-value>)",
        ochre: "rgb(var(--ochre) / <alpha-value>)",
        "ochre-deep": "rgb(var(--ochre-deep) / <alpha-value>)",
        edge: "rgb(var(--edge) / <alpha-value>)",
        "edge-soft": "rgb(var(--edge-soft) / <alpha-value>)",
      },
      boxShadow: {
        panel: "0 1px 0 rgb(var(--edge) / 0.55), 0 18px 40px -22px rgb(var(--ink) / 0.32)",
        "panel-lg": "0 1px 0 rgb(var(--edge) / 0.55), 0 28px 60px -28px rgb(var(--ink) / 0.42)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
