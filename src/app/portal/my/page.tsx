import { DEFAULT_STREAM, STREAM_LABEL, inStream, type StreamKey } from "@/config/counselling";
import { PROGRESS_STEPS, stepsDone } from "@/config/progress";
import { Empty, Panel, Readout, Readouts } from "@/components/portal/parts";
import { MentorSheet } from "@/components/portal/MentorSheet";
import { Shell } from "@/components/portal/Shell";
import { requireSession } from "@/lib/workspace/auth";
import { read } from "@/lib/workspace/store";
import {
  attentionSplit,
  isLive,
  streamCounts,
} from "@/lib/workspace/stats";

export const dynamic = "force-dynamic";

export default async function MyStudentsPage(props: PageProps<"/portal/my">) {
  const session = await requireSession(["MENTOR"]);
  const params = await props.searchParams;
  const db = await read();

  const raw = Array.isArray(params.counselling) ? params.counselling[0] : params.counselling;
  const stream = (raw ?? DEFAULT_STREAM) as StreamKey | "ALL";
  const streamName = stream === "ALL" ? "all counsellings" : STREAM_LABEL[stream as StreamKey];

  // Filtered on the server by the signed-in mentor. Another mentor's students
  // never reach this browser at all.
  const mine = db.enrolments
    .filter((e) => e.mentorId === session.id && isLive(e) && inStream(e.counselling, stream))
    .sort((a, b) => (b.assignedAt ?? "").localeCompare(a.assignedAt ?? ""));

  const { needs } = attentionSplit(mine);
  const done = mine.filter((e) => stepsDone(e.progress) === 4).length;
  const unread = db.messages.filter((m) => (m.toId === null || m.toId === session.id) && !m.readBy.includes(session.id)).length;

  return (
    <Shell session={session} streamCounts={streamCounts(db.enrolments)}
      noData={db.enrolments.length === 0} unassigned={null} unread={unread} status={`${streamName} · ${mine.length} students assigned to you`}>
      <div className="ws-grid">
        <Readouts>
          <Readout label="My students" value={mine.length} sub="assigned now" />
          <Readout label="Finished" value={done} sub="all four steps" tone="ok" />
          <Readout
            label="Needs attention"
            value={needs.length}
            sub="shaded rows below"
            tone={needs.length ? "warn" : undefined}
          />
          <Readout label="First calls done" value={mine.filter((e) => e.progress.firstCallAt).length} sub={`of ${mine.length}`} />
          <Readout label="Steps each" value={PROGRESS_STEPS.length} sub="call, checklist, cutoffs, final" />
        </Readouts>

        <Panel title="My students" hint="tick a column as you finish it" flush>
          {mine.length === 0 ? <Empty>Nobody is assigned to you yet.</Empty> : <MentorSheet rows={mine} canEdit />}
        </Panel>
      </div>
    </Shell>
  );
}
