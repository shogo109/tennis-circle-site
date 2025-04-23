/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tennis-court": "#2E7D32",
        "tennis-court-dark": "#1B5E20",
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        tennis: {
          court: "#2A5A27",
          ball: "#CFE018",
          line: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "ping-slow": {
          "0%": {
            transform: "scale(2)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "0.7",
          },
        },
        "ping-slower": {
          "0%": {
            transform: "scale(2.5)",
            opacity: "0.3",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "0.3",
          },
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "float-random": {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "20%": {
            transform: "translate(-10px, 15px)",
          },
          "40%": {
            transform: "translate(15px, -10px)",
          },
          "60%": {
            transform: "translate(-15px, -15px)",
          },
          "80%": {
            transform: "translate(10px, 10px)",
          },
        },
      },
      animation: {
        fade: "fade 0.3s ease-in-out",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-slower": "ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite 1.5s",
        "spin-slow": "spin-slow 12s linear infinite",
        "float-random": "float-random 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
