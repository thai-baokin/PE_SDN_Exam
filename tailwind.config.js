/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Flix.id Glassmorphism Theme Palette
        flix: {
          bg1: "#4E6E86",
          bg2: "#8FAABD",
          bg3: "#A9B8C4",
          blob1: "#6C8FB3",
          blob2: "#C9B7A6",
          dark: "#0F1B2D",
          glass: "rgba(255, 255, 255, 0.45)",
          glassBorder: "rgba(255, 255, 255, 0.55)",
          star: "#F5B942",
          error: "#D64545",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "28px",
        "5xl": "32px",
        pill: "999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        flix: "0 24px 60px rgba(15, 27, 45, 0.18)",
        glass: "0 12px 32px rgba(15, 27, 45, 0.10)",
        subtle: "0 4px 16px rgba(15, 27, 45, 0.06)",
        poster: "0 10px 24px rgba(15, 27, 45, 0.14)",
      },
    },
  },
  plugins: [],
}
