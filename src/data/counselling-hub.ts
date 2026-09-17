import type { IconName } from "@/components/ui/Icon";
import type { CounsellingProcess, CounsellingSlug } from "@/types";

/** Copy for the Counselling Support page (/counselling-support). */

export const hubHero = {
  eyebrow: "Counselling Support",
  title: ["JEE counselling,", "made simple."],
  body: "Four counselling systems, many rounds, one rank. JEE Ultimate 2.0 helps you pick the right counselling, build a smart choice list and act on every deadline, so your rank turns into the right seat.",
  jumps: [
    { label: "Choose counselling", href: "#choose" },
    { label: "Dates & status", href: "#status" },
    { label: "The journey", href: "#journey" },
    { label: "Terms", href: "#terms" },
    { label: "Resources", href: "#resources" },
    { label: "Compare", href: "#compare" },
  ],
};

/* ------------------------------------------------------------------ */
/* Which counselling is for me?                                        */
/* ------------------------------------------------------------------ */

export type ExamAnswer = "main" | "advanced";
export type StateAnswer = "up" | "delhi" | "other";

export const quizQuestions = [
  {
    id: "exam",
    question: "Which exam have you qualified?",
    options: [
      { value: "main", label: "JEE Main", hint: "I have a JEE Main rank" },
      { value: "advanced", label: "JEE Main + Advanced", hint: "I also qualified JEE Advanced" },
    ],
  },
  {
    id: "state",
    question: "Where did you pass Class 12?",
    options: [
      { value: "up", label: "Uttar Pradesh", hint: "Or my parents are UP domiciles" },
      { value: "delhi", label: "Delhi", hint: "A school in NCT of Delhi" },
      { value: "other", label: "Another state", hint: "Anywhere else in India" },
    ],
  },
] as const;

export type Verdict = { slug: CounsellingSlug; tag: string; level: "must" | "strong" | "backup" | "optional"; reason: string };

const levelOrder: Record<Verdict["level"], number> = { must: 0, strong: 1, backup: 2, optional: 3 };

export function recommend(exam: ExamAnswer, state: StateAnswer): Verdict[] {
  const verdicts: Verdict[] = [
    {
      slug: "josaa",
      tag: "Must register",
      level: "must",
      reason:
        exam === "advanced"
          ? "Your JEE Advanced rank opens IITs and IISc, and your JEE Main rank covers NITs, IIITs and GFTIs. One list, all of them."
          : "Your JEE Main rank covers NITs, IIITs and GFTIs. This is the main counselling for you.",
    },
    state === "up"
      ? { slug: "uptac", tag: "Strongly consider", level: "strong", reason: "As a UP student you compete in every main round for UP’s government and private colleges, with UP reservation benefits." }
      : { slug: "uptac", tag: "Optional", level: "optional", reason: "Students from outside UP (whose parents are not UP domiciles) can join only the special rounds, and without reservation benefits." },
    state === "delhi"
      ? { slug: "jac-delhi", tag: "Strongly consider", level: "strong", reason: "You compete for the 85% Delhi region seats at DTU, NSUT, IIIT-Delhi, IGDTUW and DSEU." }
      : { slug: "jac-delhi", tag: "Optional", level: "optional", reason: "Only 15% of seats are for students outside Delhi, so competition is stiff. Worth it if you want these universities." },
    {
      slug: "csab",
      tag: "Keep as backup",
      level: "backup",
      reason: "Special rounds after JoSAA fill vacant NIT, IIIT and GFTI seats. Useful if JoSAA doesn’t give you the seat you want.",
    },
  ];
  return verdicts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
}

/* ------------------------------------------------------------------ */
/* Counselling journey                                                 */
/* ------------------------------------------------------------------ */

export type JourneyStep = {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  happens: string;
  todo: string[];
  watch: string;
  notes: Partial<Record<CounsellingSlug, string>>;
};

export const journeySteps: JourneyStep[] = [
  {
    id: "eligibility",
    title: "Eligibility",
    icon: "shield",
    summary: "Make sure each counselling will accept you.",
    happens: "Every counselling has its own rules: which exam counts, the Class 12 marks you need, and which quota you belong to.",
    todo: [
      "Check the Class 12 criterion: 75% (65% for SC, ST, PwD) or top 20 percentile for JoSAA and CSAB.",
      "Know your state of eligibility: the state where you passed Class 12.",
      "Get category certificates in the right format, issued on time.",
    ],
    watch: "In 2026, OBC-NCL and EWS certificates for CSAB had to be issued on or after 1 April. An old certificate can cost you your category seat.",
    notes: {
      uptac: "Main rounds are for UP domicile candidates.",
      "jac-delhi": "85% of seats are for students who passed Class 12 in Delhi.",
    },
  },
  {
    id: "registration",
    title: "Registration",
    icon: "user",
    summary: "Sign up on each counselling portal, separately.",
    happens: "You create an account on each portal with your JEE details. Registering in one counselling does not register you in another.",
    todo: [
      "Register on every portal you plan to use, before its deadline.",
      "Pay the registration fee where there is one (₹1,000 for UPTAC, ₹1,500 for JAC Delhi in 2026).",
      "Upload documents if the portal asks for them now.",
    ],
    watch: "Deadlines overlap. In 2026, JAC Delhi registration closed on 9 June while JoSAA was still open until 11 June.",
    notes: { csab: "Everyone registers afresh, even students who took part in JoSAA." },
  },
  {
    id: "choices",
    title: "Choice filling",
    icon: "layers",
    summary: "List the colleges and branches you want, in order.",
    happens: "You add institute and branch combinations to a list, most wanted first. This list is the only thing the allotment system reads.",
    todo: [
      "Research past closing ranks for your category and quota.",
      "Put dream choices first, then realistic ones, then safe ones.",
      "Use mock allotments to see where you stand and adjust.",
    ],
    watch: "The system never offers a seat you did not list. A short list can leave you with no seat at all.",
    notes: { josaa: "Two mock allotments in 2026 (8 and 10 June) showed likely outcomes." },
  },
  {
    id: "locking",
    title: "Locking",
    icon: "lock",
    summary: "Confirm your list before the deadline.",
    happens: "Locking freezes your choice list for allotment. After the deadline, nothing can be changed.",
    todo: [
      "Review the order one last time, especially your top ten.",
      "Lock before the deadline and download a copy of your list.",
    ],
    watch: "JoSAA and CSAB lock unlocked lists automatically at the deadline, exactly as they are. Don’t leave half-finished edits.",
    notes: { uptac: "UPTAC opens a new choice window before some rounds." },
  },
  {
    id: "allocation",
    title: "Seat allocation",
    icon: "target",
    summary: "The system allots seats round by round.",
    happens: "Candidates are processed in rank order. Each gets the highest choice on their list that still has a seat for their category and quota.",
    todo: [
      "Check your result on the portal when the round is declared.",
      "Note the reporting deadline shown with your seat.",
    ],
    watch: "Getting no seat in Round 1 is common. Later rounds open up seats as others withdraw or float.",
    notes: { josaa: "5 rounds in 2026.", csab: "2 special rounds in 2026.", "jac-delhi": "4 rounds, an upgradation round and a spot round in 2026." },
  },
  {
    id: "acceptance",
    title: "Acceptance & upgrade",
    icon: "check-circle",
    summary: "Accept the seat, pay the fee and choose what happens next.",
    happens: "To keep a seat you pay the acceptance fee, upload documents and pick Freeze, Float or Slide. Floating or sliding can upgrade you in later rounds.",
    todo: [
      "Pay the seat acceptance fee before the deadline.",
      "Choose Freeze if you are happy, Float or Slide if you want better.",
      "Answer any document queries quickly.",
    ],
    watch: "If you don’t pay or respond in time, the seat is cancelled and you are out of later rounds.",
    notes: {
      josaa: "₹30,000 acceptance fee in 2026 (₹15,000 for SC, ST, PwD).",
      "jac-delhi": "₹95,000 acceptance fee in 2026.",
    },
  },
  {
    id: "reporting",
    title: "Reporting",
    icon: "building",
    summary: "Verify documents and join your institute.",
    happens: "After your final seat, you complete verification and report to the institute with original documents and the remaining fee.",
    todo: [
      "Carry originals and photocopies of every document.",
      "Pay the remaining institute fee.",
      "Check the institute’s own reporting dates.",
    ],
    watch: "Missing the reporting date can cancel your admission, even after you paid.",
    notes: {
      josaa: "NIT+ seats need a partial admission fee after the final round.",
      "jac-delhi": "Reporting is physical, at NSUT Dwarka.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Choice filling                                                      */
/* ------------------------------------------------------------------ */

export const choiceFilling = {
  title: "Your choice list decides your seat.",
  body: "Your rank decides how early you are processed. Your choice list decides what you get. The same rank can end in very different seats.",
  reasons: [
    { title: "Only your list counts", body: "The system never offers a college or branch you didn’t add." },
    { title: "Order is priority", body: "You get the highest choice your rank allows. Everything below it is skipped." },
    { title: "Too short is risky", body: "If every choice is out of reach, you get no seat in that round." },
    { title: "Upgrades need space above", body: "Floating can only move you to choices ranked higher than your current seat." },
  ],
  demo: {
    rank: 14500,
    note: "Illustrative example with made-up closing ranks, not real cutoffs.",
    careful: [
      { name: "NIT A · Computer Science", close: 9800 },
      { name: "NIT B · Computer Science", close: 13200 },
      { name: "NIT A · Electronics", close: 15900 },
      { name: "NIT B · Electronics", close: 19400 },
      { name: "NIT C · Civil", close: 45000 },
    ],
    careless: [
      { name: "NIT A · Computer Science", close: 9800 },
      { name: "NIT C · Civil", close: 45000 },
      { name: "NIT A · Electronics", close: 15900 },
      { name: "NIT B · Computer Science", close: 13200 },
      { name: "NIT B · Electronics", close: 19400 },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Terms                                                               */
/* ------------------------------------------------------------------ */

export const counsellingTerms = [
  {
    term: "Freeze",
    short: "Accept your seat and stop.",
    body: "You are happy with the seat you got. You won’t be considered in later rounds.",
    example: "You get your first choice in Round 2. You freeze and you are done.",
  },
  {
    term: "Float",
    short: "Keep the seat, try for better anywhere.",
    body: "You accept the seat but stay in the running for any higher choice, at any institute, in later rounds.",
    example: "You hold ECE at NIT B and float. In Round 3 you move up to CSE at NIT A.",
  },
  {
    term: "Slide",
    short: "Keep the seat, try for a better branch here.",
    body: "You accept the seat but only want to move to a higher choice in the same institute.",
    example: "You hold Civil at NIT A and slide. You can move to Mechanical at NIT A, but not to any other NIT.",
  },
  {
    term: "Upgrade",
    short: "Moving up your list in a later round.",
    body: "If you float or slide and a higher choice opens up, you are moved there automatically. Your old seat is released.",
    example: "Once upgraded, you can’t go back to the seat you had before.",
  },
  {
    term: "Home State",
    short: "NIT seats for students from that state.",
    body: "50% of seats at each NIT go to students whose state of eligibility (where they passed Class 12) is the NIT’s state.",
    example: "A student who passed Class 12 in Karnataka competes for Home State seats at NIT Surathkal.",
  },
  {
    term: "Other State",
    short: "NIT seats for everyone else.",
    body: "The other 50% of NIT seats are for students from every other state. Closing ranks for Home State and Other State can differ a lot.",
    example: "The same Karnataka student competes in Other State seats at every other NIT.",
  },
  {
    term: "Quota",
    short: "The pool of seats you compete in.",
    body: "Home State, Other State and All India in JoSAA; Delhi and outside Delhi in JAC Delhi; UP domicile in UPTAC. You only compete with students in the same quota.",
    example: "IIITs and most GFTIs have a single All India quota.",
  },
  {
    term: "Category",
    short: "Your reservation group.",
    body: "OPEN, GEN-EWS, OBC-NCL, SC and ST, each with a PwD version, plus female-only seats. Each category has its own closing ranks.",
    example: "Your certificate must be in the prescribed format and valid for the year, or you are moved to OPEN.",
  },
];

/* ------------------------------------------------------------------ */
/* Resources                                                           */
/* ------------------------------------------------------------------ */

export type ResourceKind = "guide" | "documents" | "seatMatrix" | "cutoffs" | "official";

export const resources: {
  id: ResourceKind;
  title: string;
  body: string;
  icon: IconName;
  cta: (name: string) => string;
  href: (p: CounsellingProcess) => string;
  external: boolean;
}[] = [
  {
    id: "guide",
    title: "Counselling guides",
    body: "Everything for one counselling: support, dates, documents and enrolment.",
    icon: "book-open-check",
    cta: (name) => `Open the ${name} guide`,
    href: (p) => p.href,
    external: false,
  },
  {
    id: "documents",
    title: "Documents checklist",
    body: "A tick-box list of what to keep ready, including category documents.",
    icon: "check-circle",
    cta: (name) => `${name} documents checklist`,
    href: (p) => `${p.href}#documents`,
    external: false,
  },
  {
    id: "seatMatrix",
    title: "Seat matrix",
    body: "How many seats each institute and branch offers, on the official portal.",
    icon: "layers",
    cta: (name) => `${name} seat matrix`,
    href: (p) => p.links.seatMatrix,
    external: true,
  },
  {
    id: "cutoffs",
    title: "Previous cutoffs",
    body: "Official opening and closing ranks from past rounds and years.",
    icon: "chart",
    cta: (name) => `${name} opening & closing ranks`,
    href: (p) => p.links.cutoffs,
    external: true,
  },
  {
    id: "official",
    title: "Official links",
    body: "The official website for notices, schedules and your login.",
    icon: "landmark",
    cta: (name) => `${name} official website`,
    href: (p) => p.links.official,
    external: true,
  },
];

/* ------------------------------------------------------------------ */
/* Comparison                                                          */
/* ------------------------------------------------------------------ */

export const comparisonRows: { label: string; values: Record<CounsellingSlug, string> }[] = [
  {
    label: "Purpose",
    values: {
      josaa: "The main joint counselling for IITs, IISc, NITs, IIITs and GFTIs.",
      csab: "Special rounds after JoSAA to fill vacant NIT+ seats.",
      uptac: "State counselling for B.Tech seats in Uttar Pradesh, run by AKTU.",
      "jac-delhi": "Joint counselling for Delhi’s state engineering universities.",
    },
  },
  {
    label: "Colleges covered",
    values: {
      josaa: "138 institutes in 2026: 23 IITs, IISc, 31 NITs, IIEST, IIITs and other GFTIs.",
      csab: "114 NIT+ institutes: NITs, IIEST, IIITs and other GFTIs. No IITs.",
      uptac: "Government colleges such as HBTU Kanpur, MMMUT Gorakhpur, IET Lucknow, KNIT Sultanpur and BIET Jhansi, plus AKTU-affiliated private colleges.",
      "jac-delhi": "DTU, NSUT, IIIT-Delhi, IGDTUW (women only) and DSEU.",
    },
  },
  {
    label: "Eligibility",
    values: {
      josaa: "JEE Advanced for IITs and IISc. JEE Main for the rest. 75% in Class 12 (65% for SC, ST, PwD) or top 20 percentile.",
      csab: "JEE Main plus NIT+ eligibility. Open to students with or without a JoSAA seat.",
      uptac: "JEE Main and 45% in Class 12 (40% for SC, ST). UP domicile for the main rounds.",
      "jac-delhi": "JEE Main Paper 1. 85% seats for Delhi region, 15% for outside Delhi. IIIT-D needs 70% aggregate and 70% in Maths.",
    },
  },
  {
    label: "When it is relevant",
    values: {
      josaa: "June to July, right after JEE Advanced results. For every JEE rank holder.",
      csab: "Late July to August, if JoSAA didn’t give you the seat you wanted.",
      uptac: "May to September, if you are from UP or want UP colleges as an option.",
      "jac-delhi": "May to August, if you want a Delhi university. Runs alongside JoSAA.",
    },
  },
  {
    label: "Rounds in 2026",
    values: {
      josaa: "5",
      csab: "2 special rounds",
      uptac: "4 rounds, internal sliding and 2 special rounds",
      "jac-delhi": "4 rounds, upgradation and spot round",
    },
  },
  {
    label: "Important considerations",
    values: {
      josaa: "Freeze, float or slide each round. IIT seats could be withdrawn only until Round 4 in 2026.",
      csab: "A new CSAB seat cancels your JoSAA seat automatically. Register afresh.",
      uptac: "New portal (uptac.samarth.edu.in). Round 4 seats are frozen automatically.",
      "jac-delhi": "Separate ₹95,000 acceptance fee. Physical reporting at NSUT Dwarka.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Members                                                             */
/* ------------------------------------------------------------------ */

export const membersCta = {
  eyebrow: "Why JEE Ultimate 2.0?",
  title: "Hear it from our members.",
  body: "Students who went through counselling with us share what it was like: the rank they started with, the decisions they made, and where they are now.",
  points: [
    { icon: "users" as IconName, text: "Guidance since 2023" },
    { icon: "graduation" as IconName, text: "Mentors who have been through counselling" },
    { icon: "hand-heart" as IconName, text: "Every student gets a plan of their own" },
  ],
  href: "/testimonials",
  label: "Hear from our members",
};
