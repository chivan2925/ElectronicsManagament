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
        primary: '#005BFF',
        navy: '#07111F',
        ink: '#111827',
        canvas: '#F6F8FB',
        panel: '#FFFFFF',
        muted: '#6B7280',
        border: '#E5E7EB',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
