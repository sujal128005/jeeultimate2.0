import localFont from "next/font/local";

/**
 * Career-only fonts. Loaded here (not from `geist/font/pixel`, which would
 * register all five pixel cuts) so the world ships exactly two files.
 */
export const pixelFont = localFont({
  src: "../../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2",
  weight: "500",
  variable: "--font-geist-pixel-square",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/** Static SemiBold cut for outlined display type (the variable font has overlapping contours). */
export const staticDisplayFont = localFont({
  src: "../../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2",
  weight: "600",
  variable: "--font-geist-static",
  display: "swap",
});
