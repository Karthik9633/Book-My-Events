export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {  
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
      },

      colors: {
        primary: "#6C2CFD",
        primaryDark: "#5B21B6",
        bgSoft: "#F6F7FB",
        textMain: "#1E1E2F",
        textMuted: "#6B7280",
      },

      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.08)",
        card: "0 8px 30px rgba(0,0,0,0.06)",
      },

      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};