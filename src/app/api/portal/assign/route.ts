import { guard } from "@/lib/workspace/auth";
import { logEvent, write } from "@/lib/workspace/store";
import type { Enrolment } from "@/lib/workspace/types";
import { stepsDone } from "@/config/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Assign, reassign, unassign.
 *
 * Two people work this queue at the same time, so the server decides, not the
 * browser. A change is only applied if the row still looks the way the client
 * last saw it. If someone else got there first the answer is 409 with the row
 * as it now stands, and their board corrects itself in place.
 */

type Body = {
  ids?: string[];
  mentorId?: string | null;
  /** updatedAt each row had when the client drew it */
  seen?: Record<string, string>;
  /** Required to move someone who already has a mentor */
  confirmReassign?: boolean;
};

function restatus(row: Enrolment): Enrolment["status"] {
  if (row.status === "REFUNDED" || row.status === "CANCELLED") return row.status;
  if (!row.mentorId) return "PAID";
  const done = stepsDone(row.progress);
  if (done === 4) return "COMPLETED";
  return done > 0 ? "IN_PROGRESS" : "ASSIGNED";
}

export async function POST(request: Request) {
  const check = await guard(["OWNER", "MANAGER"]);
  if ("deny" in check) return check.deny;
  const { session } = check;

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((id) => typeof id === "string") : [];
  if (!ids.length) return Response.json({ error: "no-rows" }, { status: 400 });

  const result = await write((db) => {
    if (body.mentorId) {
      const mentor = db.users.find((u) => u.id === body.mentorId && u.role === "MENTOR" && u.active);
      if (!mentor) return { error: "unknown-mentor" as const };
    }
    const mentorName = body.mentorId ? (db.users.find((u) => u.id === body.mentorId)?.name ?? "a mentor") : null;

    const changed: Enrolment[] = [];
    const clashes: { row: Enrolment; heldBy: string | null }[] = [];

    for (const id of ids) {
      const row = db.enrolments.find((e) => e.id === id);
      if (!row) continue;

      // Someone else touched this row since the board drew it.
      const seen = body.seen?.[id];
      if (seen && seen !== row.updatedAt) {
        clashes.push({ row, heldBy: db.users.find((u) => u.id === row.mentorId)?.name ?? null });
        continue;
      }
      // Moving someone who already has a mentor is a separate, deliberate act.
      if (row.mentorId && body.mentorId && row.mentorId !== body.mentorId && !body.confirmReassign) {
        clashes.push({ row, heldBy: db.users.find((u) => u.id === row.mentorId)?.name ?? null });
        continue;
      }

      const previous = row.mentorId;
      row.mentorId = body.mentorId ?? null;
      row.assignedAt = body.mentorId ? new Date().toISOString() : null;
      row.assignedById = body.mentorId ? session.id : null;
      row.status = restatus(row);
      row.updatedAt = new Date().toISOString();

      const action = !body.mentorId ? "unassign" : previous ? "reassign" : "assign";
      logEvent(
        db,
        session,
        action,
        row.id,
        action === "unassign"
          ? `${row.fullName} returned to the queue`
          : `${row.fullName} to ${mentorName}${previous ? " (moved)" : ""}`,
      );
      changed.push(row);
    }

    return { changed, clashes };
  });

  if ("error" in result) return Response.json(result, { status: 400 });
  const status = result.changed.length === 0 && result.clashes.length > 0 ? 409 : 200;
  return Response.json(
    {
      changed: result.changed,
      clashes: result.clashes.map((c) => ({ row: c.row, heldBy: c.heldBy })),
    },
    { status },
  );
}
