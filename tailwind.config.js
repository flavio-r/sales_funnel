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
  safelist: [
    'action-wrapper',
    'actions-button',
    'actions-menu',
    'action-item',
    'text-red-600',
    'hover:bg-red-50',
  ],

  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

