/**
 * Privacy and Terms, written against what this site actually does today, not
 * against what a counselling business is supposed to say. Where something is
 * not built yet, the clause says so instead of describing a system we do not
 * have. Update the date whenever the text changes.
 */
export const LEGAL_UPDATED = "19 September 2026";

export type LegalSection = { id: string; heading: string; paras: string[]; list?: string[] };

export const privacySections: LegalSection[] = [
  {
    id: "short",
    heading: "The short version",
    paras: [
      "This website has no accounts, no sign-up and no payment form. It does not ask you for your name, your rank or your phone number, and there is no database of visitors behind it. Everything below is the long version of that.",
    ],
  },
  {
    id: "device",
    heading: "What stays on your device",
    paras: [
      "Three things you do here are remembered, and all three are stored by your own browser on your own device. They never reach us:",
    ],
    list: [
      "Your college shortlist and your compare selection",
      "Your conversation with Saarthi",
      "Small preferences, like whether you marked our YouTube channel as subscribed",
    ],
  },
  {
    id: "device-clear",
    heading: "Clearing what is stored",
    paras: [
      "Because that data lives in your browser, you control it completely. Clearing your browsing data for this site removes all of it, and using a different browser or device gives you a clean slate. We cannot see it, restore it or transfer it for you.",
    ],
  },
  {
    id: "saarthi",
    heading: "When you ask Saarthi something",
    paras: [
      "Saarthi is an assistant built into this site. When you send a question, the text of that question, the recent messages in the same conversation and the page you are on are sent to the company whose model writes the answer. That is the only way an answer can be produced.",
      "We do not attach your name, your email or any identifier to it, because we do not have any. We do not keep a copy of your conversation on our side. The model provider handles what it receives under its own policy, so treat Saarthi the way you would treat any chat window on the internet: do not paste your application number, your password, your Aadhaar or anything you would not say out loud.",
    ],
  },
  {
    id: "contact",
    heading: "When you write to us",
    paras: [
      "If you send us something through the contact page, message us on Instagram or comment on YouTube, that message sits in our inbox or in that service, along with whatever your account shows about you. We read it, we reply, and we keep it only as long as it is useful to the conversation. Ask us to delete a thread and we will.",
    ],
  },
  {
    id: "counselling",
    heading: "If you enrol for paid counselling",
    paras: [
      "Paid counselling is not sold through this website yet. When it opens, it will need real information from you: your name, your scores and category, and documents for verification. That is a different kind of handling from anything described above, and this policy will be rewritten to cover it before a single rupee or document changes hands. We will not quietly start collecting more under the current text.",
    ],
  },
  {
    id: "third-parties",
    heading: "Third parties and tracking",
    paras: [
      "We do not sell, rent or trade anything about you, because we do not hold anything to sell. We do not run advertising trackers or profiling pixels on this site.",
      "Two outside services are involved in serving the pages: the company that hosts the site, which keeps ordinary server logs such as IP addresses for security and uptime, and YouTube, whose embedded player follows YouTube's own policy when you press play on a video. If we ever add analytics, this section will name the tool before it goes live.",
    ],
  },
  {
    id: "children",
    heading: "Students under eighteen",
    paras: [
      "Most people reading this are seventeen or eighteen. Nothing here collects information from them, and if a parent believes we hold something about their child that should be removed, one email is enough.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    paras: [
      "When this policy changes, the date at the top changes with it. We will not backdate an edit. If a change affects what we collect rather than how we describe it, we will say so on the site rather than only here.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "what",
    heading: "What this site is, and what it is not",
    paras: [
      "JEE Ultimate 2.0 is an independent guidance service. We are not JoSAA, CSAB, UPTAC, JAC Delhi, the NTA, an IIT, an NIT, an IIIT or any other institute, and we are not authorised by any of them. Nothing on this site is an official announcement.",
      "The official portals are the only authority on your admission. Where we mention a date, a rank or a rule, we link to the portal it came from so you can check it yourself. Where the two disagree, the portal is right and we are wrong, and we would like to know.",
    ],
  },
  {
    id: "information",
    heading: "The information on these pages",
    paras: [
      "Everything published here is collected from official sources and dated. Counselling changes quickly, and a page that was correct on the day it was checked can be out of date a week later. Verify anything that affects a decision on the official portal before you act on it.",
      "Where we do not have a figure, you will see a blank or a note saying so. A blank means we have not verified it, never that the value is zero.",
    ],
  },
  {
    id: "saarthi",
    heading: "Saarthi",
    paras: [
      "Saarthi is an AI assistant. It is useful for understanding how counselling works and for finding your way around this site. It can also be confidently wrong, the way every such assistant can.",
      "Do not fill a choice list, skip a round, freeze a seat or miss a deadline on the strength of what Saarthi told you. Check it against the official portal, or ask a person. Answers from Saarthi are not advice from JEE Ultimate 2.0.",
    ],
  },
  {
    id: "outcomes",
    heading: "Guidance, not a guarantee",
    paras: [
      "No one can promise you a rank, a branch, a college or a seat, and we will not pretend otherwise. What we offer is help understanding your options and the process around them. Every decision you make in counselling stays yours, and the responsibility for it stays with you and your family.",
    ],
  },
  {
    id: "content",
    heading: "Our content",
    paras: [
      "The writing, videos, graphics, datasets and code on this site belong to JEE Ultimate 2.0. You are welcome to read them, use them for your own counselling and share a link with anyone.",
      "You may not re-upload our videos, resell our material, pass it off as your own, scrape the site to rebuild it elsewhere, or use any of it to train a commercial model. If you want to use something of ours properly, ask. We usually say yes.",
    ],
  },
  {
    id: "sessions",
    heading: "Sessions with our mentors",
    paras: [
      "A mentor may end a session if someone is abusive, is recording without consent, or is sharing the session with people who have not joined it. That is about conduct, not disagreement: a mentor will never drop you for asking hard questions or for choosing differently from what they suggested.",
    ],
  },
  {
    id: "payments",
    heading: "Payments",
    paras: [
      "Paid counselling is not being sold on this website yet, and there is no checkout on it today. When it opens, the payment route will be published on the site along with what is included and what happens if you want a refund. That will be written before anything is sold, not afterwards.",
      "Until then, if anyone asks you to transfer money to a personal account in our name, it is not us. Please tell us so we can warn other students.",
    ],
  },
  {
    id: "links",
    heading: "Links to other sites",
    paras: [
      "We link to official portals, institute websites and their PDFs so you can check our work. We do not control those pages, and they can move, change or go down in the middle of a counselling round.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    paras: [
      "These terms change as the service grows, and the date at the top moves when they do. If something here reads as unfair or unclear, tell us through the contact page and say so. We would rather fix the wording than argue about it later.",
    ],
  },
];
