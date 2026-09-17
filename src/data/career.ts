import type { FormationName } from "@/lib/career/formations";
import { isTalentNetworkLive } from "@/lib/career/talent-network";

export type CareerRole = {
  id: string;
  title: string;
  line: string;
  /** The must-have for this role, shown as a requirement */
  requirement: string;
  formation: FormationName;
  formationLabel: string;
  /** World accent - particles and type take this colour when the role is active */
  accent: string;
};

/**
 * Applications are closed for now: the Join section shows a "recruiting soon"
 * state instead of the form. Flip to true (and configure the talent network,
 * see lib/career/talent-network.ts) to bring the form back.
 */
export const applicationsOpen = false;

export const careerStatus = {
  primary: "Recruiting soon",
  network: applicationsOpen && isTalentNetworkLive ? "Applications open" : "Applications opening soon",
};

export const careerHero = {
  eyebrow: "JEE Ultimate 2.0 · Careers",
  lines: [
    [
      { text: "Build", style: "solid" },
      { text: "with", style: "hollow" },
    ],
    [
      { text: "JEE", style: "metal" },
      { text: "Ultimate", style: "metal", suffix: "2.0" },
    ],
  ] as { text: string; style: "solid" | "hollow" | "metal"; suffix?: string }[][],
  lead: "We’re building the future of JEE counselling: technology, data and experiences for every student who has ever held a rank and wondered what comes next.",
  caption: "Every point of light is a decision a student has to make.",
};

export const careerStory = [
  {
    id: "problem",
    index: "01",
    label: "The problem",
    title: "Every year, lakhs of students carry a rank into a maze.",
    body: "Rounds, cutoffs, seat matrices, choices. Decided in days, felt for years.",
    formation: "chaos" as FormationName,
  },
  {
    id: "insight",
    index: "02",
    label: "What we know",
    title: "We’ve been mapping that maze since 2023.",
    body: "10,000+ IITians, NITians, IIITians & GFTIans later, we know exactly where students get lost.",
    formation: "terrain" as FormationName,
  },
  {
    id: "next",
    index: "03",
    label: "What’s next",
    title: "Now we’re building what comes after the map.",
    body: "Technology, data and experiences that make every admission decision clearer.",
    formation: "helix" as FormationName,
  },
];

export const careerRoles: CareerRole[] = [
  {
    id: "long-form-editor",
    title: "Long-Form Editor",
    line: "Cut deep-dive explainers that walk students through counselling from the first round to the final seat.",
    requirement: "15+ long-form videos edited",
    formation: "knot",
    formationLabel: "Storyline",
    accent: "#ff7ac6",
  },
  {
    id: "short-form-editor",
    title: "Short-Form Editor",
    line: "Turn one sharp insight into a reel students stop scrolling for.",
    requirement: "30+ shorts or reels edited",
    formation: "rings",
    formationLabel: "Broadcast",
    accent: "#ffb020",
  },
  {
    id: "mentor",
    title: "Mentor Counsellor",
    line: "Sit beside students at the moment their future gets decided, and guide them like a senior would.",
    requirement: "Student or graduate of an IIT, NIT or IIIT",
    formation: "vortex",
    formationLabel: "Convergence",
    accent: "#6bffb8",
  },
  {
    id: "social-media",
    title: "Social Media Lead",
    line: "Grow JEE Ultimate 2.0 across YouTube, Instagram and Facebook, and turn reach into trust.",
    requirement: "Proven growth on YouTube, Instagram & Facebook",
    formation: "neural",
    formationLabel: "Network",
    accent: "#a98bff",
  },
  {
    id: "tech-manager",
    title: "Tech Manager",
    line: "Own the website and the technical backbone, including personalised choice-filling tools for every student.",
    requirement: "Frontend, backend & Microsoft tools (Excel and more)",
    formation: "lattice",
    formationLabel: "Lattice",
    accent: "#7ce7ff",
  },
];

export const careerCta = {
  title: ["Want to build", "with us?"],
  body: "Applications for these roles open soon. Keep an eye on this page: this is where you’ll apply.",
  note: isTalentNetworkLive ? null : "Opening soon. Nothing is sent until the network is live.",
  button: "Join the talent network",
};

export const careerNav = [
  { href: "#story", label: "Story" },
  { href: "#roles", label: "Roles" },
  { href: "#join", label: "Join" },
];
