import type { CounsellingProcess } from "@/types";

const commonChapters = [
  "Eligibility & registration",
  "Choice filling strategy",
  "Rounds & seat allotment",
  "Documents & reporting",
  "Fees, withdrawal & refunds",
];

export const counsellingProcesses: CounsellingProcess[] = [
  {
    slug: "josaa",
    name: "JoSAA",
    fullName: "Joint Seat Allocation Authority",
    summary:
      "The joint counselling for IITs, NITs, IIITs and GFTIs: one registration, one choice list, several rounds.",
    scope: "National",
    basis: "JEE Advanced & JEE Main",
    covers: ["IIT", "NIT", "IIIT", "GFTI"],
    icon: "compass",
    href: "/counselling/josaa",
    chapters: [
      "Eligibility & registration",
      "Choice filling strategy",
      "Mock allotments",
      "Freeze, float & slide",
      "Documents & reporting",
      "Withdrawal & refunds",
    ],
  },
  {
    slug: "csab",
    name: "CSAB",
    fullName: "Central Seat Allocation Board",
    summary:
      "Special rounds after JoSAA that fill vacant seats in NITs, IIITs and GFTIs, a second window many students overlook.",
    scope: "National",
    basis: "JEE Main",
    covers: ["NIT", "IIIT", "GFTI"],
    icon: "waypoints",
    href: "/counselling/csab",
    chapters: commonChapters,
  },
  {
    slug: "uptac",
    name: "UPTAC",
    fullName: "Uttar Pradesh Technical Admission Counselling",
    summary:
      "State counselling for B.Tech admissions across Uttar Pradesh’s government and private engineering institutes.",
    scope: "State · Uttar Pradesh",
    basis: "JEE Main",
    covers: ["Govt. institutes", "Private institutes"],
    icon: "map-pin",
    href: "/counselling/uptac",
    chapters: commonChapters,
  },
  {
    slug: "jac-delhi",
    name: "JAC Delhi",
    fullName: "Joint Admission Counselling, Delhi",
    summary:
      "Admissions to Delhi’s state engineering universities: DTU, NSUT, IIIT-Delhi, IGDTUW and DSEU.",
    scope: "State · Delhi",
    basis: "JEE Main",
    covers: ["DTU", "NSUT", "IIIT-D", "IGDTUW", "DSEU"],
    icon: "building",
    href: "/counselling/jac-delhi",
    chapters: commonChapters,
  },
];

export function getCounselling(slug: string) {
  return counsellingProcesses.find((process) => process.slug === slug);
}
