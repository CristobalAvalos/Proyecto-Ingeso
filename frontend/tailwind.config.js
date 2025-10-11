/** @type {import('tailwindcss').Config} */
export default { // CAMBIO CLAVE: Usar 'export default' en lugar de 'module.exports'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}