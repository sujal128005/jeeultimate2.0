/**
 * Design tokens needed in JavaScript (media queries, canvas, z-order).
 * CSS remains the source of truth - keep these in sync with src/styles/tokens.css.
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 30,
  header: 50,
  dropdown: 60,
  overlay: 80,
  modal: 90,
  toast: 95,
  transition: 100,
} as const;

export const media = {
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  finePointer: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

/** World colours used when transitioning between the site and Career */
export const worldColors = {
  site: "#fbfaf7",
  career: "#04050a",
} as const;
