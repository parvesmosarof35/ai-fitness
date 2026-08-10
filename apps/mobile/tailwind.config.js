/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#665CFF', // Violet
          foreground: '#F7F5FF',
        },
        brand: {
          violet: '#665CFF',
          violetLight: '#9388FF',
          cyan: '#43E6D0',
          orange: '#FF8A4C',
        },
        background: '#0B0B13',
        backgroundRaised: '#10101A',
        surface: 'rgba(27, 27, 42, 0.76)',
        surfaceStrong: 'rgba(37, 37, 57, 0.90)',
        glassHighlight: 'rgba(255, 255, 255, 0.08)',
        glassBorder: 'rgba(175, 168, 255, 0.20)',
        success: '#43E6B1',
        warning: '#FFB45C',
        danger: '#FF5F6D',
        textPrimary: '#F7F5FF',
        textSecondary: '#AAA7BA',
        textMuted: '#696678',
        muted: '#AAA7BA',
        'muted-foreground': '#696678',
        error: '#FF5F6D',
      },
      fontFamily: {
        display: ['System'], // Fallback if custom fonts aren't used, handled via react-native Text styles
        sans: ['System'],
        mono: ['System'],
      }
    },
  },
  plugins: [],
}
