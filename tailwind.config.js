/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        ink: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          soft: '#EFF6FF'
        },
        secondary: {
          DEFAULT: '#4F46E5',
          soft: '#EEF2FF'
        },
        success: { DEFAULT: '#22C55E', soft: '#ECFDF3' },
        warning: { DEFAULT: '#F59E0B', soft: '#FFFBEB' },
        danger: { DEFAULT: '#EF4444', soft: '#FEF2F2' },
        info: { DEFAULT: '#3B82F6', soft: '#EFF6FF' },
        sidebar: {
          DEFAULT: '#0F172A',
          hover: '#1E293B',
          active: '#2563EB'
        },
        brand: {
          DEFAULT: 'var(--brand-color, #2563EB)',
          contrast: 'var(--brand-contrast, #FFFFFF)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      fontSize: {
        hero: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        section: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        cardTitle: ['18px', { lineHeight: '1.4', fontWeight: '600' }]
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl2: '14px'
      },
      spacing: {
        18: '4.5rem'
      },
      transitionDuration: {
        250: '250ms'
      }
    }
  },
  plugins: []
}
