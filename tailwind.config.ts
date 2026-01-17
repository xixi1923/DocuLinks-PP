
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      colors: {
        brand: {
          DEFAULT: '#0ea5e9', // sky-500 accent
          dark: '#0284c7'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
export default config
