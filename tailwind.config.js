/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollbarWidth: {
        none: "none",
      },
      "&::-webkit-scrollbar": {
        display: "none",
      },
      animation: {
        bounce1: "bounce 1s infinite 0.1s",
        bounce2: "bounce 1s infinite 0.2s", // 100ms delay
        bounce3: "bounce 1s infinite 0.3s", // 200ms delay
      },
    },
  },
  variants: {},
  plugins: [],
};