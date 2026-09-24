import { guard } from "@/lib/workspace/auth";
import { write } from "@/lib/workspace/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mark everything this person can see as read. */
export async function POST() {
  const check = await guard();
  if ("deny" in check) return check.deny;
  const { session } = check;

  const count = await write((db) => {
    let touched = 0;
    for (const m of db.messages) {
      const mine = m.toId === null || m.toId === session.id || m.fromId === session.id;
      if (mine && !m.readBy.includes(session.id)) {
        m.readBy.push(session.id);
        touched += 1;
      }
    }
    return touched;
  });

  return Response.json({ ok: true, marked: count });
}
