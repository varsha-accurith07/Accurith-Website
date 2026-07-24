import type { Config } from "tailwindcss";

// V01 — Design tokens. Every color, font, and radius the site uses lives here.
// Rule: no hardcoded hex values or arbitrary spacing (p-[13px]) anywhere else.
//
// Direction C "Marsal" (client-approved mockup, 2026-07-22): A&M-style
// treatment — electric blue accent, Helvetica Neue light grotesque display,
// photographic ink hero, caps letterspaced labels. The teal tokens below are
// the legacy Direction A system — still referenced by not-yet-reskinned inner
// pages; delete them when the last teal page is migrated.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Direction C accent — electric blue from the approved mockup.
        // #0E8FDD on white is ~3.5:1: fine for fills and ≥19px text, NOT for
        // small text on white — use accent-dark there (4.9:1 ✓). On dark
        // grounds use accent-light for text (7.1:1 on ink ✓).
        accent: {
          DEFAULT: "#0E8FDD",
          light: "#5FBAEE",
          dark: "#0A6DA8",
          hover: "#0B76B8",
        },
        // ---- Base theme "Ink" — photo-overlay near-black + deep navy band.
        base: "#121417", // dark page background (legacy inner pages)
        hero: "#0A0E13", // ink — hero shade, careers band, footer ground
        footer: "#0A0E13", // same ink as hero — one dark ground site-wide
        sec1: "#F2F4F6", // cool light section
        sec2: "#E9EDF0", // alt light section
        ink: {
          DEFAULT: "#1E242A", // heading on light
          2: "#4C5761", // body on light
          3: "#67717A", // muted on light (4.9:1 on white ✓)
        },
        // ---- Hairlines
        line: {
          light: "#DDE2E7",
          dark: "#1C2733",
          footer: "#1D2733",
        },
        // ---- Legacy Direction A tokens (teal audit-grid) — inner pages only.
        teal: {
          50: "#EDFAF6",
          100: "#D5F3EA",
          200: "#ACE6D6",
          300: "#7BD4BD",
          400: "#45BC9F",
          500: "#16A886",
          600: "#0E9E82",
          700: "#0B7E68",
          800: "#0A6454",
          900: "#095245",
          950: "#042E27",
        },
        brand: {
          navy: "#0B1E3D",
          mist: "#C7CDD6",
          blue: "#3E8EFF",
        },
        navy: {
          DEFAULT: "#0E1B2E", // Direction C stats band / flat tiles
          light: "#2A3D66",
          dark: "#131E36",
        },
        dark: "#222222",
      },
      fontFamily: {
        // Direction C type stack — Helvetica Neue light grotesque for display
        // AND body (the A&M look); Plex Mono stays for legacy inner-page labels.
        heading: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        kicker: "0.16em",
        label: "0.26em", // Direction C caps kickers / tile titles
        cta: "0.34em", // Direction C READ MORE-style CTA text
        brand: "0.3em", // ACCURITH wordmark under the monogram
      },
      borderRadius: {
        card: "4px", // deliberately sharp — "audit" feel
      },
      maxWidth: {
        content: "87.5rem", // 1400px content max-width
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
