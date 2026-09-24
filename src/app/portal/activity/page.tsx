import { Empty, Panel, Tag, ago, stamp } from "@/components/portal/parts";
import { Shell } from "@/components/portal/Shell";
import { requireSession } from "@/lib/workspace/auth";
import { read } from "@/lib/workspace/store";
import {
  isLive,
  streamCounts,
} from "@/lib/workspace/stats";
import type { AuditAction } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

const TONE: Record<AuditAction, "ok" | "warn" | "bad" | "sel" | undefined> = {
  signin: undefined,
  assign: "ok",
  reassign: "sel",
  unassign: "warn",
  progress: undefined,
  enrol: "sel",
  message: "sel",
};

/**
 * Who did what, and when. Two people share the assignment queue, so this is
 * how a disagreement about it gets settled.
 */
export default async function ActivityPage() {
  const session = await requireSession(["OWNER", "MANAGER", "ANALYST"]);
  const db = await read();
  const events = db.audit.slice(0, 300);
  const unread = db.messages.filter((m) => (m.toId === null || m.toId === session.id) && !m.readBy.includes(session.id)).length;

  return (
    <Shell
      session={session}
      streamCounts={streamCounts(db.enrolments)}
      noData={db.enrolments.length === 0}
      unassigned={db.enrolments.filter((e) => isLive(e) && !e.mentorId).length}
      unread={unread}
      status={`${events.length} recorded actions`}
    >
      <Panel title="Activity log" hint="the last 300 actions, newest first" flush>
        {events.length === 0 ? (
          <Empty>Nothing has happened yet.</Empty>
        ) : (
          <div className="ws-scroll">
            <table className="ws-table">
              <thead>
                <tr>
                  <th className="ws-rownum">#</th>
                  <th style={{ width: "9rem" }}>When</th>
                  <th style={{ width: "6rem" }}>Action</th>
                  <th style={{ width: "10rem" }}>By</th>
                  <th>Detail</th>
                  <th style={{ width: "6rem", textAlign: "right" }}>Ago</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={e.id}>
                    <td className="ws-rownum">{i + 1}</td>
                    <td className="ws-mono">{stamp(e.createdAt)}</td>
                    <td>
                      <Tag tone={TONE[e.action]}>{e.action}</Tag>
                    </td>
                    <td>{e.actorName}</td>
                    <td style={{ whiteSpace: "normal" }}>{e.detail}</td>
                    <td className="ws-num ws-note">{ago(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </Shell>
  );
}
