/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#05080E",
          panel: "#0A0F1A",
          card: "#101726",
          hover: "#162034",
          border: "rgba(0, 240, 255, 0.18)",
          dimBorder: "rgba(255, 255, 255, 0.08)"
        },
        tech: {
          cyan: "#00F0FF",
          green: "#00FF9D",
          amber: "#FFB800",
          red: "#FF3B30",
          blue: "#0072FF",
          text: "#E2E8F0",
          muted: "#94A3B8"
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.25)',
        'glow-green': '0 0 15px rgba(0, 255, 157, 0.25)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
