import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/innovation/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/innovation/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/innovation/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          elevated: "hsl(var(--surface-elevated) / <alpha-value>)",
          soft: "hsl(var(--surface-soft) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        sage: "hsl(var(--sage) / <alpha-value>)",
        coral: "hsl(var(--coral) / <alpha-value>)",
        gold: "hsl(var(--gold) / <alpha-value>)",
      },
      fontSize: {
        eyebrow: ["0.72rem", { lineHeight: "1rem", letterSpacing: "0.12em", fontWeight: "700" }],
        body: ["1rem", { lineHeight: "1.75rem" }],
        lead: ["1.125rem", { lineHeight: "2rem" }],
        display: ["clamp(2.5rem, 5vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "0" }],
      },
      boxShadow: {
        soft: "0 24px 80px hsl(var(--foreground) / 0.12)",
        line: "0 0 0 1px hsl(var(--foreground) / 0.08)",
        lift: "0 18px 48px hsl(var(--foreground) / 0.10)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      spacing: {
        section: "var(--space-section-y)",
      },
    },
  },
  plugins: [],
};

export default config;
