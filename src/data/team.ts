import type { IconName } from "@/components/ui/Icon";

/**
 * The crew behind JEE Ultimate 2.0.
 *
 * Add a person by pushing an object into `team`. Nothing here is invented:
 * until a real name is added, the board shows the seat as open, which is the
 * truth. `photo` is a path in /public, or null for the initials tile.
 */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** One or two lines in their own voice */
  blurb: string;
  /** Short label on the card's tab, e.g. "since 2023" */
  tag?: string;
  photo?: string | null;
  links?: { label: string; href: string }[];
};

export const team: TeamMember[] = [];

/** Seats we are actively filling. These mirror the roles on the Career page. */
export const openSeats: { id: string; role: string; note: string; icon: IconName }[] = [
  { id: "long-form-editor", role: "Long-Form Editor", note: "Turns a two hour session into a video people finish.", icon: "pen-tool" },
  { id: "short-form-editor", role: "Short-Form Editor", note: "One answer, one minute, no filler.", icon: "sparkles" },
  { id: "mentor", role: "Mentor Counsellor", note: "Sits with a rank and a worried family, and makes it make sense.", icon: "hand-heart" },
  { id: "social-media", role: "Social Media Lead", note: "Finds the students who need this and speaks their language.", icon: "megaphone" },
  { id: "tech-manager", role: "Tech Manager", note: "Keeps the site fast, honest and always up in counselling season.", icon: "code" },
];

export const teamHero = {
  eyebrow: "The crew",
  title: ["Small team.", "Loud results."],
  lede: "JEE Ultimate 2.0 is built by people who have sat through counselling themselves, not by a content farm. Drag the cards around. They do not mind.",
};

/** How we work. Statements about us, not claims about outcomes. */
export const teamPrinciples: { id: string; title: string; body: string; icon: IconName }[] = [
  {
    id: "honest",
    title: "We say when we do not know",
    body: "A blank on this site means the number is not published yet. We would rather show a gap than a guess.",
    icon: "shield",
  },
  {
    id: "official",
    title: "Official sources or nothing",
    body: "Every rank, seat and date traces back to JoSAA, CSAB, UPTAC, JAC Delhi or the institute's own page.",
    icon: "landmark",
  },
  {
    id: "human",
    title: "A person on the other end",
    body: "Tools help you shortlist. A mentor helps you decide. We are not replacing the second one with the first.",
    icon: "hand-heart",
  },
  {
    id: "season",
    title: "We move at counselling speed",
    body: "Rounds do not wait. When a schedule changes, the site changes the same day.",
    icon: "clock",
  },
];
