import type { ValuePoint } from "@/types";

export const purpose = {
  statement:
    "JoSAA rounds, CSAB special rounds, state counselling, seat matrices, freeze, float, slide: college admission can feel like a maze. We exist to make it simple, so you choose your college and your future with clarity, not confusion.",
  /** Words in the statement that pick up the brand colour as you scroll */
  emphasis: ["simple,", "clarity,"],
  pillars: [
    {
      step: "01",
      title: "Understand",
      body: "Know how each counselling works, what every round means, and where your rank fits in.",
    },
    {
      step: "02",
      title: "Plan",
      body: "Build a choice list that reflects your rank, your interests and your priorities, not someone else’s.",
    },
    {
      step: "03",
      title: "Decide",
      body: "Freeze, float or slide with confidence, with people beside you who have walked students through it before.",
    },
  ],
};

export const credibility = {
  intro:
    "JEE Ultimate 2.0 is a counselling and admission guidance platform built around one question every JEE aspirant faces: what do I do with my rank?",
  facts: [
    { value: "2023", label: "Our first counselling season", detail: "And every season since" },
    { value: "4", label: "Counselling processes", detail: "JoSAA · CSAB · UPTAC · JAC Delhi" },
    { value: "4", label: "Institute families", detail: "IIT · NIT · IIIT · GFTI" },
  ],
};

export const valuePoints: ValuePoint[] = [
  {
    title: "Experience since 2023",
    body: "We have been guiding JEE aspirants through admissions since 2023, season after season, round after round.",
    icon: "calendar",
  },
  {
    title: "Counselling knowledge",
    body: "JoSAA, CSAB, UPTAC, JAC Delhi. We know the rules, the rounds and the fine print of each process.",
    icon: "book-open-check",
  },
  {
    title: "Real admission understanding",
    body: "Our guidance is shaped by 10,000+ students who went on to IITs, NITs, IIITs and GFTIs, not by guesswork.",
    icon: "target",
  },
  {
    title: "Personal, human support",
    body: "Your rank, category, home state and goals are your own. Our mentors guide you as a person, not a data point.",
    icon: "hand-heart",
  },
  {
    title: "Complex decisions, simplified",
    body: "Seat matrices, cutoffs and branch-versus-college trade-offs, explained in plain language.",
    icon: "scale",
  },
  {
    title: "Only JEE. Fully focused.",
    body: "We don’t try to do everything. We do JEE admissions, and we give it our complete attention.",
    icon: "crosshair",
  },
];
