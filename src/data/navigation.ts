import type { LinkItem, NavItem } from "@/types";

export const mainNav: NavItem[] = [
  {
    id: "counselling",
    label: "Counselling Support",
    shortLabel: "Counselling",
    href: "/counselling-support",
    icon: "compass",
    matches: ["/counselling"],
  },
  {
    id: "colleges",
    label: "College Lists",
    shortLabel: "Colleges",
    href: "/colleges",
    icon: "landmark",
    matches: ["/college-lists"],
  },
  { id: "cutoffs", label: "Previous Cutoffs", shortLabel: "Cutoffs", href: "/previous-cutoffs", icon: "chart" },
  { id: "team", label: "Team", shortLabel: "Team", href: "/team", icon: "users" },
  { id: "career", label: "Career", shortLabel: "Career", href: "/career", icon: "briefcase", world: "career" },
];

export const footerNav: { title: string; links: LinkItem[] }[] = [
  {
    title: "Platform",
    links: [...mainNav.map(({ label, href }) => ({ label, href })), { label: "Videos", href: "/videos" }],
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
      { label: "Results & Reviews", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Only channels that are actually live. Add the rest as they open. */
export const socialLinks: LinkItem[] = [
  { label: "YouTube", href: "https://www.youtube.com/@jeeultimate2.0", external: true },
  { label: "Instagram", href: "https://www.instagram.com/rajshivamjee/", external: true },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61574348263790", external: true },
];

export const legalLinks: LinkItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
