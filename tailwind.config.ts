import type { Config } from "tailwindcss";

const config: Config = {
  future: { hoverOnlyWhenSupported: true },
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
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(6%,5%,0) scale(1.1)" },
        },
        "drift-reverse": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-7%,-4%,0) scale(0.95)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "cover-shine": {
          "0%, 60%": { transform: "translateX(-130%) skewX(-18deg)" },
          "100%": { transform: "translateX(230%) skewX(-18deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
        drift: "drift 18s ease-in-out infinite",
        "drift-reverse": "drift-reverse 24s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        "cover-shine": "cover-shine 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
