import { mainNav } from "@/data/navigation";
import type { NavItem } from "@/types";
import { GlassNav } from "./GlassNav";
import { MobileTabBar } from "./MobileTabBar";

/**
 * Picks the navigation pattern per breakpoint:
 *  - `desktop` → frosted capsule in the header (md and up)
 *  - `mobile`  → floating tab bar at the bottom (below md)
 */
export function Navigation({ variant, items = mainNav }: { variant: "desktop" | "mobile"; items?: NavItem[] }) {
  return variant === "desktop" ? <GlassNav items={items} /> : <MobileTabBar items={items} />;
}
