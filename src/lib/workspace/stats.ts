import { PROGRESS_STEPS, stepsDone } from "@/config/progress";
import { STREAMS, inStream, type StreamKey } from "@/config/counselling";
import type { Category, Database, Enrolment, Gender, User } from "./types";
import { CATEGORIES, GENDERS } from "./types";

/**
 * Every number the workspace shows is computed here, in one place, so two
 * screens can never disagree about the same figure.
 *
 * A figure that cannot be computed comes back as null, never as zero. Zero and
 * "we do not know" are different facts and the screens show them differently.
 */

export type Filters = {
  from?: string;
  to?: string;
  category?: Category | "ALL";
  gender?: Gender | "ALL";
  mentorId?: string | "ALL" | "NONE";
  status?: Enrolment["status"] | "ALL";
  counselling?: StreamKey | "ALL" | string;
  q?: string;
};

const LIVE: Enrolment["status"][] = ["PAID", "ASSIGNED", "IN_PROGRESS", "COMPLETED"];

/** Refunded and cancelled rows stay in the table but out of the counts. */
export const isLive = (e: Enrolment) => LIVE.includes(e.status);

export function applyFilters(rows: Enrolment[], f: Filters): Enrolment[] {
  const q = f.q?.trim().toLowerCase();
  return rows.filter((e) => {
    if (f.from && e.paidAt < f.from) return false;
    if (f.to && e.paidAt > f.to) return false;
    if (f.category && f.category !== "ALL" && e.category !== f.category) return false;
    if (f.gender && f.gender !== "ALL" && e.gender !== f.gender) return false;
    if (f.status && f.status !== "ALL" && e.status !== f.status) return false;
    if (f.counselling && !inStream(e.counselling, f.counselling as StreamKey | "ALL")) return false;
    if (f.mentorId === "NONE" && e.mentorId !== null) return false;
    if (f.mentorId && f.mentorId !== "ALL" && f.mentorId !== "NONE" && e.mentorId !== f.mentorId) return false;
    if (q) {
      const hay = `${e.fullName} ${e.email} ${e.phone ?? ""} ${e.rank ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const HOUR = 3600_000;

export type Headline = {
  total: number;
  assigned: number;
  unassigned: number;
  completed: number;
  revenuePaise: number;
  /** Hours from payment to assignment, median. Null when nothing is assigned. */
  medianAssignHours: number | null;
  assignSample: number;
};

export function headline(rows: Enrolment[]): Headline {
  const live = rows.filter(isLive);
  const gaps = live
    .filter((e) => e.assignedAt)
    .map((e) => (Date.parse(e.assignedAt as string) - Date.parse(e.paidAt)) / HOUR)
    .filter((h) => Number.isFinite(h) && h >= 0)
    .sort((a, b) => a - b);

  return {
    total: live.length,
    assigned: live.filter((e) => e.mentorId).length,
    unassigned: live.filter((e) => !e.mentorId).length,
    completed: live.filter((e) => e.status === "COMPLETED").length,
    revenuePaise: rows.filter((e) => e.status !== "REFUNDED").reduce((sum, e) => sum + e.amountPaise, 0),
    medianAssignHours: gaps.length ? gaps[Math.floor(gaps.length / 2)] : null,
    assignSample: gaps.length,
  };
}

export type Slice = { key: string; label: string; count: number; percent: number };

/**
 * Percentages are rounded so the column still totals 100, with the largest
 * remainder taking the difference.
 */
function toSlices(counts: { key: string; label: string; count: number }[]): Slice[] {
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  if (!total) return counts.map((c) => ({ ...c, percent: 0 }));
  const raw = counts.map((c) => ({ ...c, exact: (c.count / total) * 100 }));
  const floored = raw.map((c) => ({ ...c, percent: Math.floor(c.exact) }));
  let left = 100 - floored.reduce((sum, c) => sum + c.percent, 0);
  floored
    .map((c, i) => ({ i, rem: c.exact - Math.floor(c.exact) }))
    .sort((a, b) => b.rem - a.rem)
    .forEach(({ i }) => {
      if (left > 0) {
        floored[i].percent += 1;
        left -= 1;
      }
    });
  return floored.map(({ key, label, count, percent }) => ({ key, label, count, percent }));
}

export function categorySplit(rows: Enrolment[], label: Record<Category, string>): Slice[] {
  const live = rows.filter(isLive);
  return toSlices(CATEGORIES.map((c) => ({ key: c, label: label[c], count: live.filter((e) => e.category === c).length })));
}

export function genderSplit(rows: Enrolment[], label: Record<Gender, string>): Slice[] {
  const live = rows.filter(isLive);
  return toSlices(GENDERS.map((g) => ({ key: g, label: label[g], count: live.filter((e) => e.gender === g).length })));
}

export function counsellingSplit(rows: Enrolment[]): Slice[] {
  const live = rows.filter(isLive);
  const names = Array.from(new Set(live.map((e) => e.counselling ?? "Not given"))).sort();
  return toSlices(
    names.map((n) => ({ key: n, label: n, count: live.filter((e) => (e.counselling ?? "Not given") === n).length })),
  );
}

export const RANK_BUCKETS = [5000, 15000, 30000, 60000, 100000, 200000] as const;

export function rankHistogram(rows: Enrolment[]): { label: string; count: number }[] {
  const live = rows.filter(isLive);
  const buckets = RANK_BUCKETS.map((top, i) => ({
    label: i === 0 ? `Up to ${top.toLocaleString("en-IN")}` : `${RANK_BUCKETS[i - 1].toLocaleString("en-IN")}+`,
    count: 0,
  }));
  buckets.push({ label: `${RANK_BUCKETS[RANK_BUCKETS.length - 1].toLocaleString("en-IN")}+`, count: 0 });
  let unknown = 0;
  for (const e of live) {
    if (e.rank === null) {
      unknown += 1;
      continue;
    }
    const index = RANK_BUCKETS.findIndex((top) => (e.rank as number) <= top);
    buckets[index === -1 ? buckets.length - 1 : index].count += 1;
  }
  if (unknown) buckets.push({ label: "Rank not given", count: unknown });
  return buckets;
}

export function dailyCounts(rows: Enrolment[], days: number): { day: string; count: number; revenuePaise: number }[] {
  const out: { day: string; count: number; revenuePaise: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    const same = rows.filter((e) => e.paidAt.slice(0, 10) === key && isLive(e));
    out.push({ day: key, count: same.length, revenuePaise: same.reduce((s, e) => s + e.amountPaise, 0) });
  }
  return out;
}

export type MentorRow = {
  mentor: User;
  assigned: number;
  completed: number;
  steps: number[];
  /** Hours from assignment to first call, median. Null when none have had one. */
  medianFirstCallHours: number | null;
  firstCallSample: number;
  stalled: number;
};

export function mentorTable(db: Database, rows: Enrolment[]): MentorRow[] {
  const mentors = db.users.filter((u) => u.role === "MENTOR" && u.active);
  const now = Date.now();
  return mentors
    .map((mentor) => {
      const mine = rows.filter((e) => e.mentorId === mentor.id && isLive(e));
      const gaps = mine
        .filter((e) => e.assignedAt && e.progress.firstCallAt)
        .map((e) => (Date.parse(e.progress.firstCallAt as string) - Date.parse(e.assignedAt as string)) / HOUR)
        .filter((h) => Number.isFinite(h) && h >= 0)
        .sort((a, b) => a - b);
      return {
        mentor,
        assigned: mine.length,
        completed: mine.filter((e) => e.status === "COMPLETED").length,
        steps: PROGRESS_STEPS.map((s) => mine.filter((e) => e.progress[s.key] !== null).length),
        medianFirstCallHours: gaps.length ? gaps[Math.floor(gaps.length / 2)] : null,
        firstCallSample: gaps.length,
        stalled: mine.filter((e) => e.assignedAt && !e.progress.firstCallAt && now - Date.parse(e.assignedAt) > 24 * HOUR).length,
      };
    })
    .sort((a, b) => b.assigned - a.assigned);
}

export function funnel(rows: Enrolment[]) {
  const live = rows.filter(isLive);
  const paid = live.length;
  const assigned = live.filter((e) => e.mentorId).length;
  const started = live.filter((e) => stepsDone(e.progress) > 0).length;
  const completed = live.filter((e) => e.status === "COMPLETED").length;
  return [
    { label: "Paid", count: paid, lost: paid - assigned },
    { label: "Assigned", count: assigned, lost: assigned - started },
    { label: "Work started", count: started, lost: started - completed },
    { label: "Completed", count: completed, lost: null },
  ];
}

export function revenueBreakdown(rows: Enrolment[]) {
  const live = rows.filter((e) => e.status !== "REFUNDED");
  const now = Date.now();
  const week = now - 7 * 86_400_000;
  const month = now - 30 * 86_400_000;
  const plans = Array.from(new Set(live.map((e) => e.planCode ?? "Not given"))).sort();
  return {
    total: live.reduce((s, e) => s + e.amountPaise, 0),
    week: live.filter((e) => Date.parse(e.paidAt) >= week).reduce((s, e) => s + e.amountPaise, 0),
    month: live.filter((e) => Date.parse(e.paidAt) >= month).reduce((s, e) => s + e.amountPaise, 0),
    refundedPaise: rows.filter((e) => e.status === "REFUNDED").reduce((s, e) => s + e.amountPaise, 0),
    byPlan: plans.map((code) => {
      const same = live.filter((e) => (e.planCode ?? "Not given") === code);
      return { code, count: same.length, paise: same.reduce((s, e) => s + e.amountPaise, 0) };
    }),
  };
}

/**
 * Students whose work has stalled: no first call a day after they were
 * assigned, or no final list a week after that call. The clock is read here
 * rather than in a component, so screens stay pure functions of their data.
 */
export function attentionSplit(rows: Enrolment[]): { needs: Enrolment[]; rest: Enrolment[] } {
  const now = Date.now();
  const needs: Enrolment[] = [];
  const rest: Enrolment[] = [];
  for (const e of rows) {
    const noCall = e.assignedAt && !e.progress.firstCallAt && now - Date.parse(e.assignedAt) > 24 * HOUR;
    const slowFinish =
      e.progress.firstCallAt && !e.progress.finalListSentAt && now - Date.parse(e.progress.firstCallAt) > 7 * 24 * HOUR;
    (noCall || slowFinish ? needs : rest).push(e);
  }
  return { needs, rest };
}

/** How long ago, in words, for a queue that is measured in hours. */
export function hoursSinceLabel(iso: string): string {
  const hours = (Date.now() - Date.parse(iso)) / HOUR;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} d`;
}

/** Money is stored in paise and formatted only at the edge, never as a float. */
export const rupees = (paise: number) => `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;

export const shortRupees = (paise: number) => {
  const r = Math.round(paise / 100);
  if (r >= 10_000_000) return `₹${(r / 10_000_000).toFixed(2)} Cr`;
  if (r >= 100_000) return `₹${(r / 100_000).toFixed(2)} L`;
  if (r >= 1000) return `₹${(r / 1000).toFixed(1)}k`;
  return `₹${r}`;
};

/**
 * How many live students sit in each counselling, for the strip at the top.
 * Counted before the screen's own filters, so the numbers do not move as
 * someone narrows a list.
 */
export function streamCounts(rows: Enrolment[]): Record<string, number> {
  const live = rows.filter(isLive);
  const out: Record<string, number> = { ALL: live.length };
  for (const s of STREAMS) out[s.key] = live.filter((e) => inStream(e.counselling, s.key)).length;
  return out;
}
