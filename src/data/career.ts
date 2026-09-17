import type { FormationName } from "@/lib/career/formations";
import { isTalentNetworkLive } from "@/lib/career/talent-network";

export type CareerRole = {
  id: string;
  title: string;
  line: string;
  formation: FormationName;
  formationLabel: string;
  /** World accent - particles and type take this colour when the role is active */
  accent: string;
};

export const careerStatus = {
  primary: "Recruiting soon",
  network: isTalentNetworkLive ? "Talent network open" : "Talent network opening soon",
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
    id: "engineers",
    title: "Engineers",
    line: "Build the systems students lean on during the most stressful weeks of their year.",
    formation: "lattice",
    formationLabel: "Lattice",
    accent: "#7ce7ff",
  },
  {
    id: "ai-builders",
    title: "AI Builders",
    line: "Turn years of counselling knowledge into tools that think alongside students.",
    formation: "neural",
    formationLabel: "Network",
    accent: "#a98bff",
  },
  {
    id: "designers",
    title: "Designers",
    line: "Make complex, high-stakes decisions feel calm, clear and human.",
    formation: "knot",
    formationLabel: "Knot",
    accent: "#ff7ac6",
  },
  {
    id: "content",
    title: "Content Creators",
    line: "Explain the maze in ways students actually remember.",
    formation: "rings",
    formationLabel: "Broadcast",
    accent: "#ffb020",
  },
  {
    id: "counsellors",
    title: "Counsellors",
    line: "Sit beside students at the moment their future gets decided.",
    formation: "vortex",
    formationLabel: "Convergence",
    accent: "#6bffb8",
  },
  {
    id: "operators",
    title: "Operators",
    line: "Keep every round, every season, running like clockwork.",
    formation: "orbit",
    formationLabel: "Orbit",
    accent: "#ff8a4c",
  },
];

export const careerCta = {
  title: ["Want to build", "with us?"],
  body: isTalentNetworkLive
    ? "There are no specific openings yet. Tell us how you build, and you’ll hear from us first when roles open."
    : "There are no specific openings yet. The talent network is opening soon, and this is where you’ll join it.",
  note: isTalentNetworkLive ? null : "Opening soon. Nothing is sent until the network is live.",
  button: "Join the talent network",
};

export const careerNav = [
  { href: "#story", label: "Story" },
  { href: "#roles", label: "Roles" },
  { href: "#join", label: "Join" },
];
