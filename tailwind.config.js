/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'lexik-blue': '#3B82F6',
        'lexik-purple': '#8B5CF6',
        'lexik-indigo': '#6366F1',
      }
    },
  },
  plugins: [],
}
