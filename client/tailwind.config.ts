import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
      },
      colors: {
        // Core UI (BFME-style: dark forest + green glow + readable pale text)
        background: "hsl(150 18% 8%)",      // near-black green
        foreground: "hsl(90 25% 92%)",      // pale green-white

        card: {
          DEFAULT: "hsl(150 20% 10%)",
          foreground: "hsl(90 25% 92%)",
        },
        popover: {
          DEFAULT: "hsl(150 22% 9%)",
          foreground: "hsl(90 25% 92%)",
        },

        // Borders / inputs (subtle green metal)
        border: "hsl(140 18% 22%)",
        input: "hsl(145 18% 16%)",
        ring: "hsl(95 65% 45%)",            // green glow ring

        // Primary = glowing “button green”
        primary: {
          DEFAULT: "hsl(95 65% 40%)",
          foreground: "hsl(150 20% 8%)",
        },

        // Secondary = darker button / panel green
        secondary: {
          DEFAULT: "hsl(140 28% 18%)",
          foreground: "hsl(90 25% 92%)",
        },

        // Muted backgrounds / table rows
        muted: {
          DEFAULT: "hsl(145 20% 13%)",
          foreground: "hsl(95 18% 70%)",
        },

        // Accent = brighter moss highlight / selection
        accent: {
          DEFAULT: "hsl(105 55% 32%)",
          foreground: "hsl(90 25% 92%)",
        },

        destructive: {
          DEFAULT: "hsl(0 70% 40%)",
          foreground: "hsl(0 0% 98%)",
        },

        // Your “medal” colors tuned to LOTR-ish metallic tones
        gold: "hsl(45 75% 55%)",
        silver: "hsl(210 10% 70%)",
        bronze: "hsl(25 55% 45%)",
        success: "hsl(110 60% 38%)",

        // Sidebar matches the BFME panel look
        sidebar: {
          DEFAULT: "hsl(150 22% 7%)",
          foreground: "hsl(90 25% 92%)",
          primary: "hsl(95 65% 40%)",
          "primary-foreground": "hsl(150 20% 8%)",
          accent: "hsl(105 55% 28%)",
          "accent-foreground": "hsl(90 25% 92%)",
          border: "hsl(140 18% 20%)",
          ring: "hsl(95 65% 45%)",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
