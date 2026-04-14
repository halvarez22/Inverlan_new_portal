/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Oficial Inverland - Brand Manual
        'inverland-blue': '#0c3c5b',         // BLUE - Pantone /4C - RGB: 12, 60, 91
        'inverland-light-blue': '#9fb0c2',   // LIGHT BLUE - Pantone /36c - RGB: 159, 176, 194
        'inverland-aqua': '#6acfec',         // AQUA - Pantone 0821c - RGB: 106, 207, 236
        'inverland-off-white': '#f3f2f2',    // OFF WHITE - Pantone light g - RGB: 243, 242, 242
        'inverland-black': '#000000',         // BLACK - Pantone black - RGB: 0, 0, 0
        
        // Alias para compatibilidad y uso semántico
        'inverland-primary': '#0c3c5b',      // Azul principal (BLUE)
        'inverland-secondary': '#9fb0c2',    // Azul claro (LIGHT BLUE)
        'inverland-accent': '#6acfec',       // Aqua (AQUA)
        'inverland-light': '#f3f2f2',        // Blanco off (OFF WHITE)
        'inverland-dark': '#000000',          // Negro (BLACK)
        
        // Colores de Estado usando la paleta oficial
        'inverland-success': '#6acfec',      // Aqua para éxito
        'inverland-warning': '#9fb0c2',      // Light Blue para advertencia
        'inverland-error': '#0c3c5b',        // Blue para error (más suave)
        'inverland-info': '#6acfec',         // Aqua para información
        
        // Alias legacy para compatibilidad
        'inverland-green': '#0c3c5b',        // Mapeado al azul principal
        'inverland-gray': '#9fb0c2',         // Mapeado al light blue
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'inverland': '0 4px 6px -1px rgba(12, 60, 91, 0.1), 0 2px 4px -1px rgba(12, 60, 91, 0.06)',
        'inverland-lg': '0 10px 15px -3px rgba(12, 60, 91, 0.1), 0 4px 6px -2px rgba(12, 60, 91, 0.05)',
        'inverland-aqua': '0 4px 6px -1px rgba(106, 207, 236, 0.1), 0 2px 4px -1px rgba(106, 207, 236, 0.06)',
      }
    }
  },
  plugins: [],
}
