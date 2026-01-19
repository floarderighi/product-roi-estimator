import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Delva Brand Colors
        primary: {
          50: '#F5F0FF',
          100: '#EBE0FF',
          200: '#D6C1FF',
          300: '#C2A3FF',
          400: '#9966FF',
          500: '#6B1FFF', // Violet principal Delva
          600: '#5519CC',
          700: '#401399',
          800: '#2A0D66',
          900: '#150633',
        },
        delva: {
          violet: '#6B1FFF',
          purple: {
            light: '#9966FF',
            DEFAULT: '#6B1FFF',
            dark: '#2D0F5C',
          },
          beige: '#F5F3EF',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        'delva': '1rem', // 16px - Standard Delva
        'delva-lg': '1.5rem', // 24px - Cards
        'delva-xl': '2rem', // 32px - Large cards
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'delva-sm': '0 2px 8px rgba(107, 31, 255, 0.08)',
        'delva': '0 4px 16px rgba(107, 31, 255, 0.12)',
        'delva-lg': '0 8px 24px rgba(107, 31, 255, 0.16)',
        'delva-xl': '0 16px 48px rgba(107, 31, 255, 0.20)',
      },
    },
  },
  plugins: [],
};
export default config;
