import type { SectionPage } from "@/types";

/** Content for the Phase-1 placeholder pages behind the main navigation. */
export const sectionPages: Record<string, SectionPage> = {
  "college-lists": {
    slug: "college-lists",
    href: "/college-lists",
    eyebrow: "College Lists",
    title: "Every college, clearly listed.",
    description:
      "A calm, searchable home for IITs, NITs, IIITs and GFTIs, so you can see your options side by side before choice filling begins.",
    icon: "landmark",
    preview: "cards",
    planned: [
      "Institute directories for IITs, NITs, IIITs & GFTIs",
      "Branch-wise listings for every institute",
      "Filters by state, institute type and branch",
    ],
  },
  "previous-cutoffs": {
    slug: "previous-cutoffs",
    href: "/previous-cutoffs",
    eyebrow: "Previous Cutoffs",
    title: "Past cutoffs, made readable.",
    description:
      "Opening and closing ranks are the backbone of a good choice list. We are building a cleaner way to explore them.",
    icon: "chart",
    preview: "table",
    planned: [
      "Round-wise opening & closing ranks",
      "Filters by institute, branch, category and quota",
      "Year-on-year trends at a glance",
    ],
  },
  "counselling-support": {
    slug: "counselling-support",
    href: "/counselling-support",
    eyebrow: "Counselling Support",
    title: "Your counselling, one step at a time.",
    description:
      "Pick the counselling you’re appearing for. Each guide is being written to walk you from registration to reporting.",
    icon: "compass",
    preview: "list",
    planned: ["One-to-one mentor sessions", "Choice-list reviews", "Round-by-round guidance"],
  },
};

export const portalCopy = {
  mentor: {
    title: "Mentor workspace",
    body: "A dedicated space for JEE Ultimate 2.0 mentors and counsellors to support their students.",
    icon: "graduation",
  },
  admin: {
    title: "Admin console",
    body: "Platform control for the JEE Ultimate 2.0 owner and development team.",
    icon: "shield",
  },
  team: {
    title: "Team workspace",
    body: "Shared tools for the wider JEE Ultimate 2.0 team.",
    icon: "users",
  },
} as const;
