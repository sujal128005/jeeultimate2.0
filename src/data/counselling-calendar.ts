import type { CounsellingSlug } from "@/types";

/**
 * Counselling calendars.
 *
 * These are the 2026 dates. When the 2027 schedules are published, replace
 * each list and change `calendarYear` below. Dates are ISO (YYYY-MM-DD);
 * `end` is inclusive.
 */
export const calendarYear = 2026;

export type CalendarEventType = "registration" | "choices" | "allotment" | "reporting" | "withdrawal" | "other";

export type CalendarEvent = {
  start: string;
  end?: string;
  title: string;
  type: CalendarEventType;
  detail?: string;
};

export const eventTypes: Record<CalendarEventType, { label: string; color: string }> = {
  registration: { label: "Registration", color: "#2563eb" },
  choices: { label: "Choices & mock", color: "#7c3aed" },
  allotment: { label: "Seat allotment", color: "#f59e0b" },
  reporting: { label: "Reporting & fees", color: "#16a34a" },
  withdrawal: { label: "Withdrawal & deadlines", color: "#dc2626" },
  other: { label: "Other", color: "#64748b" },
};

export const counsellingCalendars: Record<CounsellingSlug, CalendarEvent[]> = {
  josaa: [
    { start: "2026-06-02", end: "2026-06-11", title: "Registration and choice filling", type: "registration", detail: "Opened 5 PM on 2 June, closed 5 PM on 11 June." },
    { start: "2026-06-08", title: "Mock allotment 1", type: "choices", detail: "Based on choices filled till 7 June." },
    { start: "2026-06-10", title: "Mock allotment 2 and choice locking opens", type: "choices" },
    { start: "2026-06-11", title: "Choice filling closes", type: "withdrawal", detail: "Unlocked choices were locked automatically at 5 PM." },
    { start: "2026-06-13", title: "Round 1 seat allotment", type: "allotment", detail: "Declared at 10 AM." },
    { start: "2026-06-13", end: "2026-06-26", title: "Round 1 online reporting and fee payment", type: "reporting", detail: "Fee, document upload and answering queries." },
    { start: "2026-06-30", title: "Round 2 seat allotment", type: "allotment" },
    { start: "2026-06-30", end: "2026-07-03", title: "Round 2 online reporting", type: "reporting" },
    { start: "2026-07-01", end: "2026-07-05", title: "Round 2 withdrawal or exit window", type: "withdrawal" },
    { start: "2026-07-06", title: "Round 3 seat allotment", type: "allotment" },
    { start: "2026-07-06", end: "2026-07-08", title: "Round 3 online reporting", type: "reporting" },
    { start: "2026-07-10", title: "Round 4 seat allotment", type: "allotment" },
    { start: "2026-07-10", end: "2026-07-13", title: "Round 4 online reporting", type: "reporting" },
    { start: "2026-07-14", title: "Last day to withdraw from IITs and IISc", type: "withdrawal" },
    { start: "2026-07-16", title: "Round 5 (final) seat allotment", type: "allotment" },
    { start: "2026-07-16", end: "2026-07-20", title: "Round 5 online reporting", type: "reporting" },
    { start: "2026-07-16", end: "2026-07-21", title: "NIT+ withdrawal window", type: "withdrawal" },
    { start: "2026-07-22", end: "2026-07-24", title: "NIT+ partial admission fee", type: "reporting", detail: "₹45,000, or ₹20,000 for SC, ST and PwD." },
  ],
  csab: [
    { start: "2026-07-22", end: "2026-07-23", title: "Requests to restore category", type: "other" },
    { start: "2026-07-28", title: "Vacant seats published", type: "other", detail: "15,423 seats across 114 institutes." },
    { start: "2026-07-28", end: "2026-08-03", title: "Registration, fee payment and choice filling", type: "registration" },
    { start: "2026-07-31", title: "Mock allocation", type: "choices" },
    { start: "2026-08-05", title: "Choice locking deadline", type: "withdrawal", detail: "Closed at 2 PM." },
    { start: "2026-08-06", title: "Special Round 1 result", type: "allotment", detail: "Declared at 5 PM." },
    { start: "2026-08-06", end: "2026-08-10", title: "Round 1 willingness and online reporting", type: "reporting", detail: "Freeze, float, slide, surrender or withdraw." },
    { start: "2026-08-12", title: "Special Round 2 result", type: "allotment" },
    { start: "2026-08-12", end: "2026-08-14", title: "Round 2 online reporting", type: "reporting" },
    { start: "2026-08-13", end: "2026-08-18", title: "Physical reporting at institutes", type: "reporting", detail: "Tentative. Each institute announced its own dates." },
  ],
  uptac: [
    { start: "2026-05-25", end: "2026-06-30", title: "Registration and document upload", type: "registration", detail: "First set to close on 15 June, then extended." },
    { start: "2026-07-13", end: "2026-07-16", title: "Round 1 choice filling and locking", type: "choices" },
    { start: "2026-07-18", title: "Round 1 seat allotment", type: "allotment" },
    { start: "2026-07-18", end: "2026-07-20", title: "Round 1 fee payment and freeze or float", type: "reporting" },
    { start: "2026-07-21", end: "2026-07-22", title: "Round 2 choice changes", type: "choices" },
    { start: "2026-07-24", title: "Round 2 seat allotment", type: "allotment" },
    { start: "2026-07-25", end: "2026-07-26", title: "Round 2 fee, freeze or float, withdrawal", type: "reporting" },
    { start: "2026-07-27", end: "2026-07-28", title: "Round 3 final choice locking", type: "choices" },
    { start: "2026-07-30", title: "Round 3 seat allotment", type: "allotment" },
    { start: "2026-07-31", end: "2026-08-01", title: "Round 3 fee, freeze or float, withdrawal", type: "reporting" },
    { start: "2026-08-03", title: "Round 4 seat allotment (auto-freeze)", type: "allotment" },
    { start: "2026-08-04", end: "2026-08-07", title: "Round 4 fee, physical reporting, withdrawal", type: "reporting" },
    { start: "2026-08-04", end: "2026-08-07", title: "Internal sliding: express willingness", type: "choices" },
    { start: "2026-08-08", title: "Internal sliding result and vacant seats", type: "allotment" },
    { start: "2026-08-09", end: "2026-08-15", title: "Special Round 1", type: "other", detail: "Dates were revised; registration was extended to 14 August." },
    { start: "2026-08-19", end: "2026-08-23", title: "Special Round 2 registration", type: "registration" },
    { start: "2026-08-23", end: "2026-08-30", title: "Special Round 2 choice filling", type: "choices" },
    { start: "2026-09-02", title: "Special Round 2 allotment", type: "allotment" },
    { start: "2026-09-03", end: "2026-09-07", title: "Special Round 2 physical reporting", type: "reporting" },
  ],
  "jac-delhi": [
    { start: "2026-05-28", end: "2026-06-09", title: "Registration and choice filling", type: "registration" },
    { start: "2026-06-10", title: "Document verification", type: "other", detail: "IIIT-D bonus points, Defence and Kashmiri Migrant, at NSUT Dwarka." },
    { start: "2026-06-15", title: "Round 1 result", type: "allotment" },
    { start: "2026-06-17", end: "2026-06-25", title: "Round 1 physical reporting", type: "reporting", detail: "Category and rank-wise days. Freeze deadline 25 June, 10:30 PM." },
    { start: "2026-06-26", end: "2026-06-28", title: "Second registration window and choice editing", type: "registration" },
    { start: "2026-06-29", title: "Document verification for new registrants", type: "other" },
    { start: "2026-07-01", title: "Round 2 result", type: "allotment" },
    { start: "2026-07-02", end: "2026-07-03", title: "Round 2 reporting and freeze", type: "reporting" },
    { start: "2026-07-07", title: "Round 3 result", type: "allotment" },
    { start: "2026-07-08", end: "2026-07-09", title: "Round 3 reporting and freeze", type: "reporting" },
    { start: "2026-07-12", title: "Withdrawal deadline (with refund)", type: "withdrawal", detail: "10:30 PM. No refund after this." },
    { start: "2026-07-14", title: "Round 4 result", type: "allotment" },
    { start: "2026-07-15", end: "2026-07-16", title: "Round 4 reporting and freeze", type: "reporting" },
    { start: "2026-07-20", title: "Upgradation round result", type: "allotment" },
    { start: "2026-07-21", title: "Final freeze and spot vacancies", type: "withdrawal", detail: "Final freeze by 2 PM." },
    { start: "2026-07-23", end: "2026-07-31", title: "Spot round at NSUT Dwarka", type: "other", detail: "Physical, by category and rank." },
    { start: "2026-08-03", title: "List of admitted candidates", type: "other" },
    { start: "2026-08-21", title: "IGDTUW special spot round", type: "other" },
    { start: "2026-08-24", end: "2026-08-25", title: "DTU special spot round", type: "other" },
    { start: "2026-08-27", title: "NSUT special spot round", type: "other" },
  ],
};
