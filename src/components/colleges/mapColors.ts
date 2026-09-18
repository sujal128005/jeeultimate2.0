import type { Region } from "@/lib/colleges/taxonomy";

/** One colour per region, shared by the real map and the grid view. */
export const REGION_COLORS: Record<Region, string> = {
  north: "#6366f1",
  south: "#0d9488",
  east: "#f59e0b",
  west: "#e11d48",
  northeast: "#0284c7",
};
