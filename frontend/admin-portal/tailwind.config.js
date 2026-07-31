/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        portal: '0 20px 50px rgba(18, 32, 51, 0.12)',
      },
      colors: {
        portal: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          muted: 'var(--surface-soft)',
          text: 'var(--text)',
          'text-muted': 'var(--text-muted)',
          brand: 'var(--brand)',
          'brand-strong': 'var(--brand-strong)',
          accent: 'var(--accent)',
          border: 'var(--border)',
        },
      },
    },
  },
  plugins: [],
};