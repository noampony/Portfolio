import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        hero: ["var(--font-hero)", "DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "\"SF Mono\"", "Menlo", "monospace"]
      },
      fontSize: {
        display: ["var(--type-display)", { lineHeight: "var(--leading-display)" }],
        h1: ["var(--type-h1)", { lineHeight: "var(--leading-h1)" }],
        h2: ["var(--type-h2)", { lineHeight: "var(--leading-h2)" }],
        body: ["var(--type-body)", { lineHeight: "var(--leading-body)" }],
        small: ["var(--type-small)", { lineHeight: "var(--leading-small)" }]
      },
      maxWidth: {
        measure: "var(--measure-body)"
      },
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-surface-raised": "var(--bg-surface-raised)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "accent-hover": "var(--accent-hover)",
        "accent-contrast": "var(--accent-contrast)",
        "gradient-from": "var(--gradient-from)",
        "gradient-to": "var(--gradient-to)",
        danger: "var(--danger)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          contrast: "var(--accent-contrast)",
          foreground: "var(--accent-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: []
};

export default config;
