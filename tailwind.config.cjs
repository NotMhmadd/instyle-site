/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom screen breakpoints optimized for mobile-first
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Spacing for safe areas
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Touch-friendly minimum heights
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      // Touch-friendly minimum widths
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      // Animation durations optimized for mobile
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      // Mobile-optimized font sizes
      fontSize: {
        'mobile-xs': ['0.625rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.75rem', { lineHeight: '1.25rem' }],
        'mobile-base': ['0.875rem', { lineHeight: '1.5rem' }],
        'mobile-lg': ['1rem', { lineHeight: '1.75rem' }],
        'mobile-xl': ['1.125rem', { lineHeight: '1.75rem' }],
      },
      // Border radius for mobile components
      borderRadius: {
        'mobile': '1rem',
        'mobile-lg': '1.25rem',
        'mobile-xl': '1.5rem',
      },
      // Box shadow for mobile depth
      boxShadow: {
        'mobile': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'mobile-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'mobile-xl': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'floating': '0 8px 40px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
