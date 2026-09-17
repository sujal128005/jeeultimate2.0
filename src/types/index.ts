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

export type CounsellingProcess = {
  slug: "josaa" | "csab" | "uptac" | "jac-delhi";
  name: string;
  fullName: string;
  summary: string;
  scope: string;
  basis: string;
  covers: string[];
  icon: IconName;
  href: string;
  /** Chapters planned for the dedicated guide page */
  chapters: string[];
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
