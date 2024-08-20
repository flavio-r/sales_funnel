/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '0.5': '0.5px'
      },
      boxShadow: {
        'custom-shadow': '1px 1px 4px 1px rgba(0, 0, 0, 0.15)'
      },
      colors: {
        'custom-green': '#28C26F',
        'custom-gray': '#F2F2F2',
        'custom-dark-green': '#C9DCD0',
        'custom-darker-gray': '#E5E5E5',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

