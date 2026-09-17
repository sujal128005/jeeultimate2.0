import {
  BRANCHES,
  COUNSELLING,
  INSTITUTE_TYPES,
  regionOf,
  slugify,
  type InstituteType,
  type Region,
} from "./taxonomy";

/** Shape of one record in src/data/colleges/raw/*.json (research output). */
export type RawCollege = {
  name: string;
  short: string;
  type: string;
  city: string;
  state: string;
  established?: number | null;
  ownership?: string | null;
  website?: string | null;
  logo?: string | null;
  counselling?: string[];
  quotas?: string[];
  courses?: string[];
  branches?: string[];
  seats?: number | null;
  fees?: number | null;
  hostel?: boolean | null;
  openingRank?: number | null;
  closingRank?: number | null;
  rankExam?: string | null;
  rankYear?: number | null;
  placements?: unknown;
  rating?: unknown;
  reviewHighlights?: string[];
  sources?: string[];
};

export type College = {
  slug: string;
  name: string;
  short: string;
  type: InstituteType;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  region: Region | null;
  established: number | null;
  ownership: string | null;
  website: string | null;
  logo: string | null;
  counselling: string[];
  quotas: string[];
  courses: string[];
  branches: string[];
  seats: number | null;
  fees: number | null;
  hostel: boolean | null;
  openingRank: number | null;
  closingRank: number | null;
  rankExam: "advanced" | "main";
  rankYear: number | null;
  monogram: { top: string; symbol: string };
  /** Lower-case text used for search */
  haystack: string;
};

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null);

/**
 * Periodic-table style monogram: "IIT Madras" -> { top: "IIT", symbol: "Ma" },
 * "DTU" -> { top: "", symbol: "DTU" }, "KIET Ghaziabad" -> { top: "KIET", symbol: "Gh" }.
 */
function monogramOf(short: string) {
  const words = short.replace(/[()]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return { top: "", symbol: words[0].slice(0, 5) };
  const last = words[words.length - 1];
  const top = words.slice(0, -1).join(" ");
  return { top: top.length > 9 ? words[0] : top, symbol: last.slice(0, 2) };
}

export function normalizeColleges(raw: RawCollege[]): College[] {
  const seen = new Set<string>();
  const out: College[] = [];
  for (const r of raw) {
    if (!r?.name || !r.short) continue;
    let slug = slugify(r.short);
    if (seen.has(slug)) slug = slugify(`${r.short}-${r.city}`);
    if (seen.has(slug)) continue;
    seen.add(slug);
    const typeKey = (r.type ?? "other").toLowerCase() as InstituteType;
    const type: InstituteType = typeKey in INSTITUTE_TYPES ? typeKey : "other";
    const branches = [...new Set(r.branches ?? [])];
    const counselling = [...new Set(r.counselling ?? [])];
    const haystack = [
      r.name,
      r.short,
      r.city,
      r.state,
      INSTITUTE_TYPES[type].label,
      ...branches,
      ...branches.map((b) => BRANCHES[b] ?? ""),
      ...counselling.map((c) => COUNSELLING[c] ?? c),
    ]
      .join(" ")
      .toLowerCase();
    out.push({
      slug,
      name: r.name,
      short: r.short,
      type,
      city: r.city,
      citySlug: slugify(r.city),
      state: r.state,
      stateSlug: slugify(r.state),
      region: regionOf(r.state),
      established: num(r.established),
      ownership: r.ownership ?? null,
      website: r.website ?? null,
      logo: r.logo ?? null,
      counselling,
      quotas: [...new Set(r.quotas ?? [])],
      courses: [...new Set(r.courses ?? [])],
      branches,
      seats: num(r.seats),
      fees: num(r.fees),
      hostel: typeof r.hostel === "boolean" ? r.hostel : null,
      openingRank: num(r.openingRank),
      closingRank: num(r.closingRank),
      rankExam: r.rankExam === "advanced" ? "advanced" : "main",
      rankYear: num(r.rankYear),
      monogram: monogramOf(r.short),
      haystack,
    });
  }
  return out;
}
