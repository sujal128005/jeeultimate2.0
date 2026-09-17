import type { IconName } from "@/components/ui/Icon";

export type NavItem = {
  id: string;
  label: string;
  /** Used where space is tight - tablet nav and the mobile tab bar */
  shortLabel: string;
  href: string;
  icon: IconName;
  /** Extra path prefixes that should mark this item active */
  matches?: string[];
  /** Destination is an immersive world - navigate with the world transition */
  world?: "career";
};

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type RoleOption = {
  id: "mentor" | "admin" | "team";
  label: string;
  description: string;
  href: string;
  icon: IconName;
};

export type CounsellingSlug = "josaa" | "csab" | "uptac" | "jac-delhi";

/** Colour identity of a counselling. `accent` for fills, `ink` for small text on light surfaces (AA). */
export type CounsellingTheme = {
  accent: string;
  ink: string;
  /** Second gradient stop for hero tickets */
  glow: string;
};

export type CounsellingFact = { label: string; value: string; note?: string };

export type CounsellingLink = { label: string; href: string };

export type EnrolmentPlan = {
  name: string;
  /** Price in rupees. `null` shows "Price announced soon". */
  price: number | null;
  /** Direct enrolment link. `null` shows "Enrolment opens soon". */
  href: string | null;
  includes: string[];
};

export type CounsellingProcess = {
  slug: CounsellingSlug;
  name: string;
  fullName: string;
  summary: string;
  scope: string;
  basis: string;
  covers: string[];
  icon: IconName;
  href: string;
  theme: CounsellingTheme;
  /** When the counselling usually runs, e.g. "June to July" */
  season: string;
  /** Key facts from the 2026 cycle */
  facts: CounsellingFact[];
  eligibility: string[];
  considerations: string[];
  documents: { everyone: string[]; ifApplicable: string[] };
  links: {
    official: string;
    seatMatrix: string;
    cutoffs: string;
    brochure: string;
    extra?: CounsellingLink[];
  };
  plan: EnrolmentPlan;
  /** What we know about the next cycle */
  nextCycle: string;
  /** Where the dates and figures come from */
  sourceNote: string;
};

export type ValuePoint = {
  title: string;
  body: string;
  icon: IconName;
};

export type NewsCategory = "JoSAA" | "CSAB" | "UPTAC" | "JAC Delhi" | "Strategy";

/**
 * Shape expected from the future news API.
 * Keep this stable and map the backend response into it.
 */
export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string; // ISO date
  readingMinutes: number;
  featured?: boolean;
  href: string;
};

export type PlaceholderPreview = "table" | "chart" | "form" | "cards" | "list";

export type SectionPage = {
  slug: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: IconName;
  preview: PlaceholderPreview;
  planned: string[];
};
