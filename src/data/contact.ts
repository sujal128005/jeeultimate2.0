import type { IconName } from "@/components/ui/Icon";

/**
 * Contact, arranged by what you want rather than by one catch-all form.
 *
 * The address below is not printed on the page: it is where the delivery route
 * sends what people write, and where the fallback mail window points when the
 * site has no mail key configured yet.
 */
export const BUSINESS_EMAIL = "shivamraj.connectme@gmail.com";

export type ContactLane = {
  id: "business" | "counselling" | "correction" | "join";
  who: string;
  title: string;
  body: string;
  icon: IconName;
};

export const contactLanes: ContactLane[] = [
  {
    id: "business",
    who: "I have a business proposal",
    title: "Business deals and partnerships",
    body: "Sponsorships, collaborations, bulk counselling for a school or coaching centre, anything with a contract attached.",
    icon: "briefcase",
  },
  {
    id: "counselling",
    who: "I am a student or a parent",
    title: "A question about counselling",
    body: "Ranks, rounds, documents, which counselling to join, what a choice list should look like. Ask Saarthi first, it is on every page and answers straight away.",
    icon: "compass",
  },
  {
    id: "correction",
    who: "Something here is wrong",
    title: "Report a problem",
    body: "A number that does not match the official source, a page that will not load, a link that goes nowhere. Tell us where it is and what you expected.",
    icon: "shield",
  },
  {
    id: "join",
    who: "I want to work with you",
    title: "Joining the team",
    body: "Editors, mentors, social, engineering. The Career world has every open role written out properly, along with what the work actually involves.",
    icon: "users",
  },
];

/** What the report form offers under "What is it about". */
export const problemTopics = [
  "Wrong or outdated information",
  "Website glitch or error",
  "A link or download that does not work",
  "Something looks broken on my phone",
  "Saarthi gave a wrong answer",
  "Someone is impersonating JEE Ultimate 2.0",
  "Something else",
];
