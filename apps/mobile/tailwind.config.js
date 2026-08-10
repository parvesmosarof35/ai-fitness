/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22d3ee', // Cyan
          foreground: '#09090b',
        },
        brand: {
          cyan: '#22d3ee',
          purple: '#a855f7',
          orange: '#fb923c',
        },
        background: '#0a0a0f',
        surface: '#15151a',
        'surface-highlight': '#222228',
        muted: '#a1a1aa',
        'muted-foreground': '#71717a',
        error: '#ef4444',
      }
    },
  },
  plugins: [],
}
