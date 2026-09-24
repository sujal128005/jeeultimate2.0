/**
 * JoSAA 2026 Round 1, as reported by our own students.
 *
 * Built from the replies to our Round 1 result form. Only what a student
 * was allotted is published here: the institute and the branch. No names,
 * no ranks tied to a person, no category, no contact details. Those were
 * given to us to run counselling, not to put on a website.
 *
 * These are Round 1 figures. JoSAA runs several more rounds, so a student
 * with no seat here very often has one by the end.
 */

export const RESULTS_ROUND = "JoSAA 2026, Round 1";
export const RESULTS_COLLECTED = "June 2026";

export const resultsSummary = {
  responses: 168,
  withSeat: 107,
  noSeatYet: 61,
  iit: 34,
  nit: 34,
  iiit: 19,
  gfti: 20,
  bestRank: 3029,
  rankSample: 98,
} as const;

export type InstituteGroup = { key: "iit" | "nit" | "iiit" | "gfti"; label: string; seats: number; places: { name: string; count: number }[] };

export const resultsByGroup: InstituteGroup[] = [
  {
    key: "iit",
    label: "IITs",
    seats: 34,
    places: [
      { name: "IIT Kharagpur", count: 6 },
      { name: "IIT (BHU) Varanasi", count: 4 },
      { name: "IIT Bombay", count: 3 },
      { name: "IIT Hyderabad", count: 3 },
      { name: "IIT Roorkee", count: 3 },
      { name: "IIT Guwahati", count: 2 },
      { name: "IIT Indore", count: 2 },
      { name: "IIT Jodhpur", count: 2 },
      { name: "IIT Mandi", count: 2 },
      { name: "IIT (ISM) Dhanbad", count: 1 },
      { name: "IIT Gandhinagar", count: 1 },
      { name: "IIT Madras", count: 1 },
      { name: "IIT Palakkad", count: 1 },
      { name: "IIT Patna", count: 1 },
      { name: "IIT Ropar", count: 1 },
    ],
  },
  {
    key: "nit",
    label: "NITs",
    seats: 34,
    places: [
      { name: "NIT Tiruchirappalli", count: 5 },
      { name: "VNIT Nagpur", count: 5 },
      { name: "NIT Patna", count: 4 },
      { name: "NIT Kurukshetra", count: 3 },
      { name: "NIT Raipur", count: 3 },
      { name: "MNNIT Allahabad", count: 2 },
      { name: "NIT Rourkela", count: 2 },
      { name: "NIT Srinagar", count: 2 },
      { name: "NIT Agartala", count: 1 },
      { name: "NIT Arunachal Pradesh", count: 1 },
      { name: "NIT Hamirpur", count: 1 },
      { name: "NIT Sikkim", count: 1 },
      { name: "NIT Surathkal", count: 1 },
      { name: "NIT Warangal", count: 1 },
    ],
  },
  {
    key: "iiit",
    label: "IIITs",
    seats: 19,
    places: [
      { name: "IIIT Bhopal", count: 4 },
      { name: "IIIT Pune", count: 3 },
      { name: "IIIT Guwahati", count: 2 },
      { name: "IIIT Vadodara", count: 2 },
      { name: "IIIT Kottayam", count: 1 },
      { name: "IIIT Lucknow", count: 1 },
      { name: "IIIT Manipur", count: 1 },
      { name: "IIIT Nagpur", count: 1 },
      { name: "IIIT Naya Raipur", count: 1 },
      { name: "IIIT Ranchi", count: 1 },
      { name: "IIIT Surat", count: 1 },
      { name: "IIIT Una", count: 1 },
    ],
  },
  {
    key: "gfti",
    label: "GFTIs and other institutes",
    seats: 20,
    places: [
      { name: "BIT Mesra", count: 2 },
      { name: "Gati Shakti Vishwavidyalaya", count: 2 },
      { name: "IITRAM Ahmedabad", count: 2 },
      { name: "Assam University, Silchar", count: 1 },
      { name: "BIT Mesra, Deoghar campus", count: 1 },
      { name: "BIT Mesra, Patna campus", count: 1 },
      { name: "Guru Ghasidas Vishwavidyalaya", count: 1 },
      { name: "Gurukula Kangri Vishwavidyalaya", count: 1 },
      { name: "NIELIT Aurangabad", count: 1 },
      { name: "NIELIT Ropar", count: 1 },
      { name: "NIFTEM", count: 1 },
      { name: "PEC Chandigarh", count: 1 },
      { name: "SLIET Longowal", count: 1 },
      { name: "University of Hyderabad", count: 1 },
    ],
  },
];

export const resultsBranches: { name: string; count: number }[] = [
  { name: "Computer Science and Engineering", count: 23 },
  { name: "Mechanical Engineering", count: 12 },
  { name: "Electronics and Communication Engineering", count: 12 },
  { name: "Civil Engineering", count: 9 },
  { name: "Electrical Engineering", count: 8 },
  { name: "Chemical Engineering", count: 7 },
  { name: "Materials Engineering", count: 5 },
  { name: "Biomedical Engineering", count: 3 },
  { name: "Artificial Intelligence and Data Science", count: 3 },
  { name: "Ocean Engineering", count: 2 },
  { name: "Engineering Physics", count: 2 },
  { name: "Instrumentation and Control", count: 2 },
  { name: "Ceramic Engineering", count: 1 },
  { name: "Information Technology", count: 1 },
  { name: "Maritime Engineering", count: 1 },
  { name: "Metallurgical Engineering", count: 1 },
  { name: "Mathematics and Computing", count: 1 },
  { name: "Food Technology", count: 1 },
];
