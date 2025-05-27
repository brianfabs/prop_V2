/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
} 