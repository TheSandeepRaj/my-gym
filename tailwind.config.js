/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#3b82f6",
        accent: "#1e3a8a",
        body: "#111827",
        muted: "#6b7280",
      },
      boxShadow: {
        blue: "3px 3px 0 0 #3b82f6",
        "blue-hover": "6px 6px 0 0 #1e3a8a",
      },
    },
  },
  plugins: [],
};
