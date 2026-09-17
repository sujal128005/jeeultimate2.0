import type { LinkItem, NavItem, RoleOption } from "@/types";

export const mainNav: NavItem[] = [
  {
    id: "counselling",
    label: "Counselling Support",
    shortLabel: "Counselling",
    href: "/counselling-support",
    icon: "compass",
    matches: ["/counselling"],
  },
  { id: "colleges", label: "College Lists", shortLabel: "Colleges", href: "/colleges", icon: "landmark", matches: ["/college-lists"] },
  { id: "cutoffs", label: "Previous Cutoffs", shortLabel: "Cutoffs", href: "/previous-cutoffs", icon: "chart" },
  { id: "predictor", label: "AI Predictor", shortLabel: "Predictor", href: "/ai-predictor", icon: "sparkles" },
  { id: "career", label: "Career", shortLabel: "Career", href: "/career", icon: "briefcase", world: "career" },
];

export const roleOptions: RoleOption[] = [
  {
    id: "mentor",
    label: "Mentor",
    description: "Student mentors & counsellors",
    href: "/portal/mentor",
    icon: "graduation",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Owner & platform control",
    href: "/portal/admin",
    icon: "shield",
  },
  {
    id: "team",
    label: "Team",
    description: "JEE Ultimate 2.0 team members",
    href: "/portal/team",
    icon: "users",
  },
];

export const footerNav: { title: string; links: LinkItem[] }[] = [
  {
    title: "Platform",
    links: mainNav.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Counselling",
    links: [
      { label: "JoSAA", href: "/counselling/josaa" },
      { label: "CSAB", href: "/counselling/csab" },
      { label: "UPTAC", href: "/counselling/uptac" },
      { label: "JAC Delhi", href: "/counselling/jac-delhi" },
      { label: "Updates", href: "/news" },
    ],
  },
  {
    title: "JEE Ultimate 2.0",
    links: [
      { label: "About", href: "/#about" },
      { label: "Why JEE Ultimate 2.0", href: "/#why" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Replace the `#` placeholders with the real profile URLs. */
export const socialLinks: LinkItem[] = [
  { label: "Instagram", href: "#", external: true },
  { label: "YouTube", href: "#", external: true },
  { label: "Telegram", href: "#", external: true },
  { label: "X", href: "#", external: true },
  { label: "LinkedIn", href: "#", external: true },
];

export const legalLinks: LinkItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
