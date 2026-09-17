import type { College } from "./model";
import { BRANCHES, INSTITUTE_TYPES, REGIONS, type Region } from "./taxonomy";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

export const FACETS = ["type", "state", "city", "branch", "course", "category", "quota", "counselling"] as const;
export type Facet = (typeof FACETS)[number];

export const SORTS = {
  popularity: "Popularity",
  name: "Name",
  location: "Location",
  fees: "Fees",
  cutoff: "Cutoff",
} as const;
export type SortKey = keyof typeof SORTS;

export type ExplorerState = Record<Facet, string[]> & {
  q: string;
  region: Region | null;
  sort: SortKey;
  view: "grid" | "list";
};

export const emptyState: ExplorerState = {
  q: "",
  type: [],
  state: [],
  city: [],
  branch: [],
  course: [],
  category: [],
  quota: [],
  counselling: [],
  region: null,
  sort: "popularity",
  view: "grid",
};

const facetValues = (c: College, facet: Facet): string[] => {
  switch (facet) {
    case "type":
      return [c.type];
    case "state":
      return [c.stateSlug];
    case "city":
      return [c.citySlug];
    case "branch":
      return c.branches;
    case "course":
      return c.courses;
    case "category":
      return c.ownership ? [c.ownership] : [];
    case "quota":
      return c.quotas;
    case "counselling":
      return c.counselling;
  }
};

/* ------------------------------------------------------------------ */
/* URL                                                                  */
/* ------------------------------------------------------------------ */

export function stateFromParams(params: URLSearchParams): ExplorerState {
  const list = (key: string) =>
    (params.get(key) ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  const region = params.get("region");
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    type: list("type"),
    state: list("state"),
    city: list("city"),
    branch: list("branch"),
    course: list("course"),
    category: list("category"),
    quota: list("quota").map((q) => q.toUpperCase()),
    counselling: list("counselling"),
    region: region && region in REGIONS ? (region as Region) : null,
    sort: sort && sort in SORTS ? (sort as SortKey) : emptyState.sort,
    view: params.get("view") === "list" ? "list" : "grid",
  };
}

export function paramsFromState(s: ExplorerState): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  for (const f of FACETS) if (s[f].length) p.set(f, s[f].map((v) => (f === "quota" ? v.toLowerCase() : v)).join(","));
  if (s.region) p.set("region", s.region);
  if (s.sort !== emptyState.sort) p.set("sort", s.sort);
  if (s.view !== "grid") p.set("view", s.view);
  // keep commas readable in shared links
  return p.toString().replace(/%2C/g, ",");
}

/* ------------------------------------------------------------------ */
/* Filtering                                                            */
/* ------------------------------------------------------------------ */

function matchesQuery(c: College, q: string) {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.every((t) => c.haystack.includes(t));
}

function matches(c: College, s: ExplorerState, skip?: Facet | "region") {
  if (s.q && !matchesQuery(c, s.q)) return false;
  if (skip !== "region" && s.region && c.region !== s.region) return false;
  for (const f of FACETS) {
    if (f === skip || s[f].length === 0) continue;
    const values = facetValues(c, f);
    if (!s[f].some((v) => values.includes(v))) return false;
  }
  return true;
}

export function filterColleges(all: College[], s: ExplorerState) {
  return sortColleges(
    all.filter((c) => matches(c, s)),
    s.sort,
  );
}

/** How many colleges each option of a facet would leave, given the other filters. */
export function facetCounts(all: College[], s: ExplorerState, facet: Facet) {
  const counts = new Map<string, number>();
  for (const c of all) {
    if (!matches(c, s, facet)) continue;
    for (const v of facetValues(c, facet)) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}

export function regionCounts(all: College[], s: ExplorerState) {
  const counts = new Map<Region, number>();
  for (const c of all) {
    if (!c.region || !matches(c, s, "region")) continue;
    counts.set(c.region, (counts.get(c.region) ?? 0) + 1);
  }
  return counts;
}

export function activeFilterCount(s: ExplorerState) {
  return FACETS.reduce((n, f) => n + s[f].length, 0) + (s.region ? 1 : 0);
}

/* ------------------------------------------------------------------ */
/* Sorting                                                              */
/* ------------------------------------------------------------------ */

const TYPE_ORDER = Object.keys(INSTITUTE_TYPES);
const nullsLast = (a: number | null, b: number | null) =>
  a === null && b === null ? 0 : a === null ? 1 : b === null ? -1 : a - b;
/** JEE Advanced ranks (IITs, IISc) and JEE Main ranks are different lists: rank each within its own list. */
const examOrder = (c: College) => (c.rankExam === "advanced" ? 0 : 1);
const byName = (a: College, b: College) => a.short.localeCompare(b.short);

export function sortColleges(list: College[], sort: SortKey) {
  const sorted = [...list];
  switch (sort) {
    case "name":
      return sorted.sort(byName);
    case "location":
      return sorted.sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city) || byName(a, b));
    case "fees":
      return sorted.sort((a, b) => nullsLast(a.fees, b.fees) || byName(a, b));
    case "cutoff":
      return sorted.sort(
        (a, b) =>
          nullsLast(a.closingRank === null ? null : 0, b.closingRank === null ? null : 0) ||
          examOrder(a) - examOrder(b) ||
          nullsLast(a.closingRank, b.closingRank) ||
          byName(a, b),
      );
    case "popularity":
    default:
      return sorted.sort(
        (a, b) =>
          nullsLast(a.openingRank === null ? null : 0, b.openingRank === null ? null : 0) ||
          examOrder(a) - examOrder(b) ||
          nullsLast(a.openingRank, b.openingRank) ||
          TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) ||
          byName(a, b),
      );
  }
}

/* ------------------------------------------------------------------ */
/* Suggestions                                                          */
/* ------------------------------------------------------------------ */

export type Suggestion =
  | { kind: "college"; id: string; label: string; hint: string; value: string; type: College["type"] }
  | { kind: "city"; id: string; label: string; hint: string; value: string }
  | { kind: "state"; id: string; label: string; hint: string; value: string }
  | { kind: "branch"; id: string; label: string; hint: string; value: string };

export const SUGGESTION_GROUPS = [
  { kind: "college", label: "Colleges" },
  { kind: "city", label: "Cities" },
  { kind: "state", label: "States" },
  { kind: "branch", label: "Branches" },
] as const;

const plural = (n: number) => `${n} college${n === 1 ? "" : "s"}`;

export function suggest(all: College[], query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (text: string) => {
    const t = text.toLowerCase();
    if (t.startsWith(q)) return 0;
    if (t.split(/[\s(),-]+/).some((w) => w.startsWith(q))) return 1;
    return t.includes(q) ? 2 : -1;
  };

  const colleges = all
    .map((c) => ({ c, s: Math.min(...[score(c.short), score(c.name)].map((v) => (v < 0 ? 9 : v))) }))
    .filter((x) => x.s < 9)
    .sort((a, b) => a.s - b.s || byName(a.c, b.c))
    .slice(0, 5)
    .map<Suggestion>(({ c }) => ({
      kind: "college",
      id: `college-${c.slug}`,
      label: c.short,
      hint: `${c.city}, ${c.state}`,
      value: c.short,
      type: c.type,
    }));

  const group = (key: "city" | "state") => {
    const map = new Map<string, { label: string; n: number; state: string }>();
    for (const c of all) {
      const label = key === "city" ? c.city : c.state;
      const slug = key === "city" ? c.citySlug : c.stateSlug;
      if (score(label) < 0) continue;
      const e = map.get(slug) ?? { label, n: 0, state: c.state };
      e.n++;
      map.set(slug, e);
    }
    return [...map.entries()]
      .sort((a, b) => score(a[1].label) - score(b[1].label) || b[1].n - a[1].n)
      .slice(0, 4)
      .map<Suggestion>(([slug, e]) => ({
        kind: key,
        id: `${key}-${slug}`,
        label: e.label,
        hint: key === "city" ? `${e.state} · ${plural(e.n)}` : plural(e.n),
        value: slug,
      }));
  };

  const branchCounts = new Map<string, number>();
  for (const c of all) for (const b of c.branches) branchCounts.set(b, (branchCounts.get(b) ?? 0) + 1);
  const branches = Object.entries(BRANCHES)
    .filter(([code, label]) => branchCounts.has(code) && (score(label) >= 0 || code === q))
    .sort((a, b) => (a[0] === q ? -1 : b[0] === q ? 1 : score(a[1]) - score(b[1])))
    .slice(0, 4)
    .map<Suggestion>(([code, label]) => ({
      kind: "branch",
      id: `branch-${code}`,
      label,
      hint: plural(branchCounts.get(code) ?? 0),
      value: code,
    }));

  return [...colleges, ...group("city"), ...group("state"), ...branches];
}
