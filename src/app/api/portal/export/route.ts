import { PROGRESS_STEPS } from "@/config/progress";
import { guard } from "@/lib/workspace/auth";
import { read } from "@/lib/workspace/store";
import { applyFilters, type Filters } from "@/lib/workspace/stats";
import { CATEGORY_LABEL, GENDER_LABEL, STATUS_LABEL } from "@/lib/workspace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A spreadsheet cell that starts with =, +, - or @ can run when opened. */
const cell = (value: unknown) => {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  const check = await guard(["OWNER", "MANAGER", "ANALYST"]);
  if ("deny" in check) return check.deny;

  const url = new URL(request.url);
  const filters: Filters = {
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    category: (url.searchParams.get("category") as Filters["category"]) ?? undefined,
    gender: (url.searchParams.get("gender") as Filters["gender"]) ?? undefined,
    mentorId: url.searchParams.get("mentorId") ?? undefined,
    status: (url.searchParams.get("status") as Filters["status"]) ?? undefined,
    counselling: url.searchParams.get("counselling") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
  };

  const db = await read();
  const rows = applyFilters(db.enrolments, filters);
  const mentorName = (id: string | null) => (id ? (db.users.find((u) => u.id === id)?.name ?? "") : "");

  const header = [
    "Paid on",
    "Name",
    "Email",
    "Phone",
    "Rank",
    "Category",
    "Gender",
    "Home state",
    "Counselling",
    "Amount (INR)",
    "Plan",
    "Status",
    "Mentor",
    "Assigned on",
    ...PROGRESS_STEPS.map((s) => s.label),
  ];

  const body = rows.map((e) =>
    [
      e.paidAt,
      e.fullName,
      e.email,
      e.phone,
      e.rank,
      CATEGORY_LABEL[e.category],
      GENDER_LABEL[e.gender],
      e.homeState,
      e.counselling,
      (e.amountPaise / 100).toFixed(2),
      e.planCode,
      STATUS_LABEL[e.status],
      mentorName(e.mentorId),
      e.assignedAt,
      ...PROGRESS_STEPS.map((s) => e.progress[s.key]),
    ]
      .map(cell)
      .join(","),
  );

  const csv = [header.map(cell).join(","), ...body].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="enrolments-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
