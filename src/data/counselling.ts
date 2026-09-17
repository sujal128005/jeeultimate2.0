import type { CounsellingProcess, CounsellingSlug } from "@/types";

/**
 * The four counselling systems we support.
 *
 * Facts, fees and dates are from the 2026 cycle (official brochures and
 * schedules where available). Update them when the 2027 notices are out.
 *
 * ENROLMENT: set `plan.price` (in rupees) and `plan.href` (your payment or
 * sign-up link) for each counselling. While they are `null` the site shows
 * "Price announced soon" and "Enrolment opens soon".
 */
export const counsellingProcesses: CounsellingProcess[] = [
  {
    slug: "josaa",
    name: "JoSAA",
    fullName: "Joint Seat Allocation Authority",
    summary:
      "The joint counselling for IITs, IISc, NITs, IIITs and GFTIs: one registration, one choice list, several rounds.",
    scope: "National",
    basis: "JEE Advanced & JEE Main",
    covers: ["IIT", "IISc", "NIT", "IIIT", "GFTI"],
    icon: "compass",
    href: "/counselling/josaa",
    theme: { accent: "#4f46e5", ink: "#4338ca", glow: "#8b5cf6" },
    season: "June to July",
    facts: [
      { label: "Rounds in 2026", value: "5" },
      { label: "Institutes", value: "138", note: "23 IITs, IISc, 31 NITs, IIEST, IIITs and GFTIs" },
      { label: "Seats in 2026", value: "67,323", note: "4,470 more than 2025" },
      { label: "Seat acceptance fee", value: "₹30,000", note: "₹15,000 for SC, ST and PwD" },
    ],
    eligibility: [
      "IITs and IISc: qualify JEE Advanced and meet the Class 12 criterion.",
      "NITs, IIITs and GFTIs: a JEE Main rank and the Class 12 criterion.",
      "Class 12 criterion: 75% aggregate (65% for SC, ST and PwD) or the top 20 percentile of your board.",
      "NITs split seats 50% Home State and 50% Other State. IIITs and most GFTIs are All India.",
    ],
    considerations: [
      "You choose Freeze, Float or Slide after every allotment you accept.",
      "In 2026, IIT and IISc seats could be withdrawn only until Round 4. NIT+ seats until the final round.",
      "NIT+ seats need a partial admission fee after the final round (₹45,000, or ₹20,000 for SC, ST and PwD in 2026).",
      "Unlocked choices are locked automatically when choice filling closes.",
    ],
    documents: {
      everyone: [
        "Provisional seat allotment letter",
        "Passport-size photos (same as in JEE registration)",
        "Signed candidate undertaking",
        "Valid photo ID",
        "Class 10 marksheet or proof of date of birth",
        "Class 12 marksheet and pass certificate",
        "Medical certificate in the prescribed format",
        "Proof of seat acceptance fee payment",
      ],
      ifApplicable: [
        "OBC-NCL or GEN-EWS certificate in the prescribed format",
        "SC or ST certificate",
        "PwD certificate or UDID card",
        "Passport or OCI/PIO card (foreign nationals, OCI, PIO)",
      ],
    },
    links: {
      official: "https://josaa.nic.in/",
      seatMatrix: "https://josaa.admissions.nic.in/applicant/seatmatrix/seatmatrixinfo.aspx",
      cutoffs: "https://josaa.admissions.nic.in/applicant/seatmatrix/openingclosingrankarchieve.aspx",
      brochure: "https://josaa.nic.in/document/business-rule-3/",
      extra: [
        { label: "Schedule", href: "https://josaa.nic.in/schedule/" },
        { label: "FAQs", href: "https://josaa.nic.in/faq/" },
      ],
    },
    plan: {
      name: "JoSAA Counselling Support",
      price: null,
      href: null,
      includes: [
        "A personal mentor through every round",
        "A choice list built around your rank, category and home state",
        "Freeze, float or slide advice after each allotment",
        "Document checks and deadline reminders",
      ],
    },
    nextCycle:
      "JoSAA 2027 dates are not announced yet. In 2026, registration opened on 2 June, the day after JEE Advanced results.",
    sourceNote: "Dates and fees from the official JoSAA 2026 schedule and business rules.",
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
    theme: { accent: "#0d9488", ink: "#0f766e", glow: "#22d3ee" },
    season: "Late July to August",
    facts: [
      { label: "Special rounds in 2026", value: "2" },
      { label: "Institutes", value: "114", note: "NITs, IIEST, IIITs and other GFTIs. No IITs." },
      { label: "Vacant seats at start", value: "15,423", note: "Published 28 July 2026" },
      { label: "Enrolment fee", value: "₹40,000", note: "₹19,000 for SC, ST and PwD (fresh candidates)" },
    ],
    eligibility: [
      "A JEE Main rank and eligibility for NIT+ seats under JoSAA rules.",
      "Class 12 criterion: 75% aggregate (65% for SC, ST and PwD) or the top 20 percentile of your board.",
      "Open to students with no JoSAA seat, and to many who got one (including NIT+ seat holders).",
      "Everyone registers afresh. JoSAA choices do not carry over.",
    ],
    considerations: [
      "A new CSAB seat cancels your JoSAA seat automatically, so list only choices you truly prefer.",
      "Only two rounds in 2026, so there is little room to correct a weak choice list.",
      "Withdrawal is possible only in Round 1. The ₹5,000 processing fee is never refunded.",
      "Not paying the second institute fee or not reporting online counts as rejecting the seat.",
    ],
    documents: {
      everyone: [
        "Proof of date of birth (Class 10 marksheet, Aadhaar or birth certificate)",
        "Class 12 marksheet and certificate",
        "JEE Main admit card",
        "Medical fitness certificate in the prescribed format",
        "Bank details with a cancelled cheque or passbook copy",
      ],
      ifApplicable: [
        "Category certificate (OBC-NCL and EWS dated on or after 1 April of the counselling year)",
        "PwD certificate or UDID card",
        "OCI/PIO card or passport",
        "Certified English or Hindi translation of any other-language certificate",
      ],
    },
    links: {
      official: "https://csab.nic.in/",
      seatMatrix: "https://csab.nic.in/document/tentative-seat-vacancy-for-csab-special-rounds-2026/",
      cutoffs: "https://admissions.nic.in/csabspl/Applicant/seatallotmentresult/openingclosingrankarchieve.aspx",
      brochure: "https://csab.nic.in/document/information-brochure/",
      extra: [
        { label: "Special rounds", href: "https://csab.nic.in/csab-special/" },
        { label: "CSAB-NEUT", href: "https://csab.nic.in/csab-neut/" },
      ],
    },
    plan: {
      name: "CSAB Special Rounds Support",
      price: null,
      href: null,
      includes: [
        "A clear yes or no on whether CSAB is worth it for you",
        "A tight choice list for the two special rounds",
        "Advice on keeping or risking your JoSAA seat",
        "Fee, refund and reporting guidance",
      ],
    },
    nextCycle:
      "CSAB 2027 dates are not announced yet. In 2026, special round registration opened on 28 July, after JoSAA ended.",
    sourceNote: "Dates and fees from the official CSAB 2026 information brochure.",
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
    theme: { accent: "#e11d48", ink: "#be123c", glow: "#fb923c" },
    season: "May to September",
    facts: [
      { label: "Rounds in 2026", value: "4 + 2", note: "4 regular rounds, internal sliding, then 2 special rounds" },
      { label: "Run by", value: "AKTU", note: "New portal: uptac.samarth.edu.in" },
      { label: "Registration fee", value: "₹1,000", note: "All categories" },
      { label: "Seat confirmation fee", value: "₹20,000", note: "₹12,000 for SC and ST (as reported)" },
    ],
    eligibility: [
      "A JEE Main score and Class 12 with Physics, Maths and one more science subject.",
      "At least 45% in Class 12 (40% for SC and ST).",
      "UP domicile: you passed Class 12 in UP, or your parents are UP domiciles.",
      "Students from outside UP whose parents are not UP domiciles can join only the special rounds.",
    ],
    considerations: [
      "Government colleges fill all first-year seats through UPTAC. Private colleges fill 85%.",
      "Reservation benefits apply only to UP domicile candidates.",
      "Round 4 seats are frozen automatically. After that, only internal sliding can change your branch.",
      "Your fee is refunded only if you withdraw inside a withdrawal window.",
    ],
    documents: {
      everyone: [
        "Recent colour photo and scanned signature",
        "Class 10 and Class 12 marksheets",
        "JEE Main scorecard",
        "Medical fitness certificate",
        "Photo ID (Aadhaar or similar)",
        "Character certificate and transfer or migration certificate",
      ],
      ifApplicable: [
        "SC, ST or OBC certificate in the UPTAC format",
        "EWS certificate",
        "Domicile certificate (if you studied outside UP)",
        "Armed forces or freedom fighter dependant certificate",
        "Income certificate for the tuition fee waiver (TFW) seats",
      ],
    },
    links: {
      official: "https://uptac.samarth.edu.in/",
      seatMatrix: "https://uptac.samarth.edu.in/index.php/seat-matrix/index",
      cutoffs: "https://uptac.samarth.edu.in/index.php/cut-off-matrix/index",
      brochure: "https://uptac.samarth.edu.in/index.php/notifications/index",
      extra: [{ label: "2025 ranks (old portal)", href: "https://uptac.admissions.nic.in/or-cr/" }],
    },
    plan: {
      name: "UPTAC Counselling Support",
      price: null,
      href: null,
      includes: [
        "Government and private college shortlist for your rank",
        "Round-by-round freeze and float advice",
        "Internal sliding and special round strategy",
        "Domicile and document guidance",
      ],
    },
    nextCycle:
      "UPTAC 2027 dates are not announced yet. In 2026, registration opened on 25 May and the last special round ended in September.",
    sourceNote:
      "Eligibility from the UPTAC 2026 brochure. Round dates were revised during the cycle and are the latest reported by news sites.",
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
    theme: { accent: "#0284c7", ink: "#0369a1", glow: "#34d399" },
    season: "May to August",
    facts: [
      { label: "Rounds in 2026", value: "4 + 2", note: "4 rounds, an upgradation round and a spot round" },
      { label: "Seats", value: "7,765", note: "Engineering seats across 5 universities" },
      { label: "Registration fee", value: "₹1,500" },
      { label: "Seat acceptance fee", value: "₹95,000" },
    ],
    eligibility: [
      "A JEE Main Paper 1 rank.",
      "85% of seats are for the Delhi region (Class 12 passed from a school in Delhi), 15% for outside Delhi.",
      "IIIT-Delhi asks for 70% aggregate and 70% in Maths in Class 12.",
      "IGDTUW admits women only.",
    ],
    considerations: [
      "JAC Delhi needs its own registration and fee. It runs at the same time as JoSAA.",
      "Reporting is physical, at NSUT Dwarka.",
      "The seat acceptance fee is refunded only before the withdrawal deadline (12 July in 2026).",
      "No fresh registration is allowed in the spot round.",
    ],
    documents: {
      everyone: [
        "JAC registration printout, signed by you and a parent",
        "JEE Main admit card and scorecard",
        "Class 10 and Class 12 marksheets, plus the Class 12 admit card",
        "Medical fitness certificate",
        "Three passport-size photos",
        "Seat allotment letter and fee receipt",
      ],
      ifApplicable: [
        "SC, ST, OBC-NCL, EWS or PwD certificate",
        "Defence (CW) or Kashmiri Migrant (KM) documents",
        "Single girl child affidavit",
        "IIIT-Delhi bonus point documents",
      ],
    },
    links: {
      official: "https://jacdelhi.admissions.nic.in/",
      seatMatrix: "https://jacdelhi.admissions.nic.in/seat-matrix/",
      cutoffs: "https://jacdelhi.admissions.nic.in/or-cr/",
      brochure: "https://jacdelhi.admissions.nic.in/document/admission-brochure-jac-delhi-2026/",
      extra: [
        { label: "Schedule", href: "https://jacdelhi.admissions.nic.in/schedule/" },
        { label: "Vacant seats", href: "https://jacdelhi.admissions.nic.in/vacant-seat/" },
      ],
    },
    plan: {
      name: "JAC Delhi Counselling Support",
      price: null,
      href: null,
      includes: [
        "DTU, NSUT, IIIT-D, IGDTUW and DSEU options for your rank",
        "Planning JAC alongside JoSAA without clashes",
        "Freeze, float and upgradation advice",
        "Reporting day checklist for NSUT Dwarka",
      ],
    },
    nextCycle:
      "JAC Delhi 2027 dates are not announced yet. In 2026, registration opened on 28 May.",
    sourceNote: "Dates and fees from the official JAC Delhi 2026 schedule, brochure and spot round notices.",
  },
];

export function getCounselling(slug: string) {
  return counsellingProcesses.find((process) => process.slug === slug);
}

export const counsellingBySlug = Object.fromEntries(counsellingProcesses.map((p) => [p.slug, p])) as Record<
  CounsellingSlug,
  CounsellingProcess
>;
