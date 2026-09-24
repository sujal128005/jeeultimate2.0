import { PROGRESS_STEPS, stepsDone, type ProgressKey } from "@/config/progress";
import { guard } from "@/lib/workspace/auth";
import { logEvent, write } from "@/lib/workspace/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEYS = PROGRESS_STEPS.map((s) => s.key) as readonly ProgressKey[];

/**
 * Tick or untick one of the four steps. A mentor may only touch their own
 * students; an owner or manager may touch any. An analyst may touch none, and
 * that is enforced here rather than by hiding the checkbox.
 */
export async function POST(request: Request) {
  const check = await guard(["OWNER", "MANAGER", "MENTOR"]);
  if ("deny" in check) return check.deny;
  const { session } = check;

  let body: { id?: string; key?: string; done?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const key = body.key as ProgressKey;
  if (!body.id || !KEYS.includes(key)) return Response.json({ error: "bad-request" }, { status: 400 });

  const result = await write((db) => {
    const row = db.enrolments.find((e) => e.id === body.id);
    // A mentor asking about someone else's student is told it does not exist,
    // which is the truth as far as they are concerned.
    if (!row) return { error: "not-found" as const };
    if (session.role === "MENTOR" && row.mentorId !== session.id) return { error: "not-found" as const };

    row.progress[key] = body.done ? new Date().toISOString() : null;
    const done = stepsDone(row.progress);
    if (row.status !== "REFUNDED" && row.status !== "CANCELLED") {
      row.status = !row.mentorId ? "PAID" : done === 4 ? "COMPLETED" : done > 0 ? "IN_PROGRESS" : "ASSIGNED";
    }
    row.updatedAt = new Date().toISOString();

    const label = PROGRESS_STEPS.find((s) => s.key === key)?.label ?? key;
    logEvent(db, session, "progress", row.id, `${label} ${body.done ? "marked done" : "cleared"} for ${row.fullName}`);
    return { row };
  });

  if ("error" in result) return Response.json(result, { status: 404 });
  return Response.json({ row: result.row });
}
