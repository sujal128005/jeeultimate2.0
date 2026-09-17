/**
 * Shared vocabularies for the College explorer: institute types, branches,
 * courses, ownership ("category"), quotas, counselling and regions.
 */

export const INSTITUTE_TYPES = {
  iit: { label: "IIT", plural: "IITs", color: "#4f46e5" },
  nit: { label: "NIT", plural: "NITs", color: "#0d9488" },
  iiit: { label: "IIIT", plural: "IIITs", color: "#7c3aed" },
  gfti: { label: "GFTI", plural: "GFTIs", color: "#d97706" },
  other: { label: "Other", plural: "Other", color: "#475569" },
} as const;
export type InstituteType = keyof typeof INSTITUTE_TYPES;

export const BRANCHES: Record<string, string> = {
  cse: "Computer Science",
  ai: "AI & Data Science",
  mnc: "Mathematics & Computing",
  it: "Information Technology",
  ece: "Electronics & Communication",
  ee: "Electrical",
  eee: "Electrical & Electronics",
  instr: "Instrumentation",
  me: "Mechanical",
  prod: "Production & Industrial",
  ce: "Civil",
  che: "Chemical",
  aero: "Aerospace",
  meta: "Metallurgy & Materials",
  mining: "Mining",
  petro: "Petroleum",
  ephys: "Engineering Physics",
  bio: "Biotech & Biomedical",
  textile: "Textile",
  ocean: "Naval & Ocean",
  agri: "Agricultural & Food",
  env: "Environmental",
  arch: "Architecture",
  plan: "Planning",
  design: "Design",
  sci: "Sciences & BS",
  other: "Other programmes",
};

export const COURSES: Record<string, string> = {
  btech: "B.Tech / B.E.",
  dual: "Dual degree (B.Tech + M.Tech)",
  intmtech: "Integrated M.Tech / M.Sc",
  bs: "BS / BS-MS",
  barch: "B.Arch",
  bplan: "B.Planning",
  bdes: "B.Des",
};

/** Shown to students as "Category": who runs the institute. */
export const OWNERSHIP: Record<string, string> = {
  central: "Central government",
  state: "State government",
  ppp: "Public-private (PPP)",
  deemed: "Deemed university",
  private: "Private",
};

export const QUOTAS: Record<string, string> = {
  AI: "All India",
  HS: "Home State",
  OS: "Other State",
  GO: "Goa",
  JK: "Jammu & Kashmir",
  LA: "Ladakh",
  DL: "Delhi region",
  ODL: "Outside Delhi",
  UP: "UP domicile",
};

export const COUNSELLING: Record<string, string> = {
  josaa: "JoSAA",
  csab: "CSAB",
  "jac-delhi": "JAC Delhi",
  uptac: "UPTAC",
};

export const REGIONS = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  northeast: "Northeast",
} as const;
export type Region = keyof typeof REGIONS;

const STATE_REGION: Record<string, Region> = {
  "jammu and kashmir": "north",
  ladakh: "north",
  "himachal pradesh": "north",
  punjab: "north",
  chandigarh: "north",
  haryana: "north",
  delhi: "north",
  uttarakhand: "north",
  "uttar pradesh": "north",
  rajasthan: "north",
  gujarat: "west",
  maharashtra: "west",
  goa: "west",
  "madhya pradesh": "west",
  "dadra and nagar haveli and daman and diu": "west",
  bihar: "east",
  jharkhand: "east",
  "west bengal": "east",
  odisha: "east",
  chhattisgarh: "east",
  "andaman and nicobar islands": "east",
  "andhra pradesh": "south",
  telangana: "south",
  karnataka: "south",
  kerala: "south",
  "tamil nadu": "south",
  puducherry: "south",
  lakshadweep: "south",
  assam: "northeast",
  "arunachal pradesh": "northeast",
  manipur: "northeast",
  meghalaya: "northeast",
  mizoram: "northeast",
  nagaland: "northeast",
  sikkim: "northeast",
  tripura: "northeast",
};

export function regionOf(state: string): Region | null {
  return STATE_REGION[state.trim().toLowerCase()] ?? null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
