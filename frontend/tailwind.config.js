/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B1019',           // Main background
          nav: '#111827',          // Navigation background
          section: '#0D111A',      // Secondary section background
          card: '#151E2B',         // Card surface
          cardHover: '#1B2637',    // Card hover state
          border: '#263244',       // Standard borders
          subtle: '#1E293B',       // Subtle dividers
        },
        primary: '#F4F7FA',        // Primary text
        secondary: '#94A3B8',      // Secondary text
        muted: '#64748B',          // Muted text
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',          // Primary accent teal
          600: '#0D9488',          // Hover teal
          700: '#0F766E',
          900: '#134E4A',
          950: '#042F2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
