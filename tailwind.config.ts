import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#09090B",
          soft: "#141416",
        },
        gold: {
          DEFAULT: "#C6A15B",
          soft: "#E4C990",
        },
        paper: "#F7F4EF",
        mist: "#A1A1AA",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(198,161,91,0.25), 0 20px 60px -20px rgba(198,161,91,0.25)",
        card: "0 1px 0 0 rgba(247,244,239,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "gold-fade": "linear-gradient(135deg, #C6A15B 0%, #E4C990 50%, #C6A15B 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
