export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#E1FF17',
        secondary: '#3b82f6',
        dark: '#161616',
        dark1: '#1e1e1e',
        light: '#ffffff',
        muted: '#9ca3af',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
