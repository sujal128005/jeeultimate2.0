/**
 * The crew behind JEE Ultimate 2.0.
 *
 * Add a person by pushing an object into `team`. Nothing here is invented:
 * a field left empty stays empty on the page rather than being filled with a
 * guess. `photo` is a path in /public (drop the files into /public/team), or
 * null for the initials tile. `instagram` is the handle without the @.
 */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** Short role label used on the card's tab */
  tag?: string;
  /** One or two lines in their own voice. Edit these freely. */
  blurb: string;
  /** "technical" swaps the card's plate for a wiring-diagram treatment. */
  theme?: "technical";
  photo?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  /** Personal site, shown inline next to the role rather than as its own chip. */
  site?: { label: string; href: string } | null;
  links?: { label: string; href: string }[];
};

export const team: TeamMember[] = [
  {
    id: "shivam-raj",
    name: "Shivam Raj",
    role: "Founder & CEO",
    tag: "Founder",
    blurb: "Started JEE Ultimate 2.0 and decides what we take on. Still the voice on most of the counselling sessions.",
    photo: null,
    instagram: "shivam_raj369",
  },
  {
    id: "ashu-kumar",
    name: "Ashu Kumar",
    role: "Co-founder",
    tag: "Co-founder",
    blurb: "Co-founded JEE Ultimate 2.0. Works on how students find us and what reaches them first.",
    photo: null,
    instagram: "analogous_ashu",
  },
  {
    id: "sujal-negi",
    name: "Sujal Negi",
    role: "Chief Technical Officer",
    tag: "CTO",
    theme: "technical",
    blurb: "Builds and runs this site. Every number on it has to trace back to an official source before it ships.",
    photo: null,
    instagram: "sujal128005_",
    linkedin: "https://www.linkedin.com/in/sujalnegi128005/",
    site: { label: "sujalnegi.tech", href: "https://sujalnegi.tech" },
  },
];
