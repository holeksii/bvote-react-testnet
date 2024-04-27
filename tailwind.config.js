/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      keyframes: {
        twitch: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 50%, 90%": { transform: "translateX(-5px)" },
          "30%, 70%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        twitch: "twitch 0.7s ease-in-out",
      },
      colors: {
        slate: {
          50: "#f6f9fb",
          100: "#e9eff4",
          200: "#cbd8e6",
          300: "#a9bcd7",
          400: "#809eb8",
          500: "#587e98",
          600: "#4e5359",
          700: "#354e5d",
          800: "#292929",
          900: "#212121",
          950: "#0f0f0f",
        },
        blue: {
          500: "#66aaeee8",
        },
      },
      screens: {
        "2xl": "1024",
        xl: "1024",
      },
    },
  },
  plugins: [],
};
