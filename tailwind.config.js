/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b5fa3', // Example lighter blue
          medium: '#1d3e75', // Previous dark becomes medium
          DEFAULT: '#3a6bb7', // Slightly lighter blue for primary
          dark: '#1d3e75',   // Previous medium is now dark (hover)
          70: 'rgba(120, 150, 202, 0.7)', // 70% opacity of new primary
        },
      },
      spacing: {
        '0': '0px',
        '0.5': '4px',   // 4px - Fine-grained spacing
        '1': '8px',     // 8px
        '2': '16px',    // 16px
        '3': '24px',    // 24px
        '4': '32px',    // 32px
        '5': '40px',    // 40px
        '6': '48px',    // 48px
        '7': '56px',    // 56px
        '8': '64px',    // 64px
        '9': '72px',    // 72px
        '10': '80px',   // 80px
      },
      keyframes: {
        'fade-out-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
      },
      animation: {
        'fade-out-left': 'fade-out-left 0.4s ease-in both',
      },
    },
  },
  plugins: [],
} 