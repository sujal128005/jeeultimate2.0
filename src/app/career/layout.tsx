import type { Viewport } from "next";
import { worldColors } from "@/lib/tokens";
import { pixelFont, staticDisplayFont } from "./fonts";

export const viewport: Viewport = {
  themeColor: worldColors.career,
  colorScheme: "dark",
};

/** The Career world ships its own display fonts and chrome. */
export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${pixelFont.variable} ${staticDisplayFont.variable}`}>{children}</div>;
}
