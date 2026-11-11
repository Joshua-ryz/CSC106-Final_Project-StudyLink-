/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // StudyLink Dark Mode Palette
        'sl-bg-main': '#0B0D12',
        'sl-bg-secondary': '#11141C',
        'sl-bg-card': '#171B25',
        'sl-bg-input': '#202532',
        'sl-accent-primary': '#7775F5',
        'sl-accent-secondary': '#5C8DFF',
        'sl-text-primary': '#F5F6FA',
        'sl-text-secondary': '#9CA3B4',
        'sl-border': '#2A3040',
        'sl-success': '#22C55E',
        'sl-error': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(119, 117, 245, 0.15)',
        'glow-secondary': '0 0 40px rgba(92, 141, 255, 0.1)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}