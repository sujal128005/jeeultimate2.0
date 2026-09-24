import { DEFAULT_STREAM, STREAM_LABEL, inStream, type StreamKey } from "@/config/counselling";
import { AssignBoard } from "@/components/portal/AssignBoard";
import { Shell } from "@/components/portal/Shell";
import { Readout, Readouts } from "@/components/portal/parts";
import { requireSession } from "@/lib/workspace/auth";
import { read } from "@/lib/workspace/store";
import { hoursSinceLabel, streamCounts } from "@/lib/workspace/stats";
import { isLive } from "@/lib/workspace/stats";
import type { Enrolment } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

export default async function AssignPage(props: PageProps<"/portal/assign">) {
  const session = await requireSession(["OWNER", "MANAGER"]);
  const params = await props.searchParams;
  const db = await read();

  // One counselling at a time. A JoSAA queue and a UPTAC queue move on
  // different calendars, and mixing them is how a student gets forgotten.
  const raw = Array.isArray(params.counselling) ? params.counselling[0] : params.counselling;
  const stream = (raw ?? DEFAULT_STREAM) as StreamKey | "ALL";
  const streamName = stream === "ALL" ? "all counsellings" : STREAM_LABEL[stream as StreamKey];

  const live = db.enrolments.filter((e) => isLive(e) && inStream(e.counselling, stream));
  const queue = live.filter((e) => !e.mentorId).sort((a, b) => a.paidAt.localeCompare(b.paidAt));

  const mentors = db.users
    .filter((u) => u.role === "MENTOR" && u.active)
    .map((u) => ({ id: u.id, name: u.name, load: live.filter((e) => e.mentorId === u.id).length }));

  const columns: Record<string, Enrolment[]> = {};
  for (const mentor of mentors) {
    columns[mentor.id] = live
      .filter((e) => e.mentorId === mentor.id)
      .sort((a, b) => (b.assignedAt ?? "").localeCompare(a.assignedAt ?? ""));
  }

  const oldest = queue[0];

  const unread = db.messages.filter((m) => (m.toId === null || m.toId === session.id) && !m.readBy.includes(session.id)).length;

  return (
    <Shell
      session={session}
      streamCounts={streamCounts(db.enrolments)}
      noData={db.enrolments.length === 0}
      unassigned={queue.length}
      unread={unread}
      status={`${streamName} · ${queue.length} waiting · ${mentors.length} mentors on duty`}
    >
      <div className="ws-grid">
        <Readouts>
          <Readout label="Waiting" value={queue.length} sub="no mentor yet" tone={queue.length ? "warn" : "ok"} />
          <Readout
            label="Longest wait"
            value={oldest ? hoursSinceLabel(oldest.paidAt) : null}
            sub={oldest ? oldest.fullName : "queue is empty"}
          />
          <Readout label="Assigned" value={live.length - queue.length} sub="across all mentors" />
          <Readout label="Mentors on duty" value={mentors.length} sub="active accounts" />
        </Readouts>

        <AssignBoard initialQueue={queue} initialAssigned={columns} mentors={mentors} />
      </div>
    </Shell>
  );
}
