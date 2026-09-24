import { PROGRESS_STEPS } from "@/config/progress";
import { Empty, Panel, StepDots, Tag, hoursLabel, shortDate, stepsOf } from "@/components/portal/parts";
import { Filters } from "@/components/portal/Filters";
import { Shell } from "@/components/portal/Shell";
import { requireSession } from "@/lib/workspace/auth";
import { filtersFromParams } from "@/lib/workspace/query";
import { read } from "@/lib/workspace/store";
import {
  applyFilters,
  isLive,
  mentorTable,
  streamCounts,
} from "@/lib/workspace/stats";
import { CATEGORY_LABEL } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

const KEYS = PROGRESS_STEPS.map((s) => s.key);

export default async function MentorsPage(props: PageProps<"/portal/mentors">) {
  const session = await requireSession(["OWNER", "MANAGER", "ANALYST"]);
  const params = await props.searchParams;
  const db = await read();

  const rows = applyFilters(db.enrolments, filtersFromParams(params));
  const table = mentorTable(db, rows);
  const mentorNames = db.users.filter((u) => u.role === "MENTOR" && u.active).map((u) => ({ id: u.id, name: u.name }));
  const unread = db.messages.filter((m) => (m.toId === null || m.toId === session.id) && !m.readBy.includes(session.id)).length;

  return (
    <Shell
      session={session}
      streamCounts={streamCounts(db.enrolments)}
      noData={db.enrolments.length === 0}
      unassigned={rows.filter((e) => isLive(e) && !e.mentorId).length}
      unread={unread}
      status={`${table.length} mentors`}
    >
      <div className="ws-grid">
        <Filters mentors={mentorNames} />

        <Panel title="Mentor performance" hint="how far each mentor's students have got" flush>
          {table.length === 0 ? (
            <Empty>No mentors yet.</Empty>
          ) : (
            <div className="ws-scroll">
              <table className="ws-table">
                <thead>
                  <tr>
                    <th className="ws-rownum">#</th>
                    <th className="ws-freeze">Mentor</th>
                    <th style={{ textAlign: "right" }}>Students</th>
                    <th style={{ textAlign: "right" }}>Finished</th>
                    {PROGRESS_STEPS.map((s) => (
                      <th key={s.key} className="ws-tick">
                        {s.short}
                      </th>
                    ))}
                    <th style={{ textAlign: "right" }}>To first call</th>
                    <th style={{ textAlign: "right" }}>Stalled</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((m, i) => (
                    <tr key={m.mentor.id}>
                      <td className="ws-rownum">{i + 1}</td>
                      <td className="ws-freeze ws-strong">{m.mentor.name}</td>
                      <td className="ws-num">{m.assigned}</td>
                      <td className="ws-num">{m.completed}</td>
                      {m.steps.map((count, step) => (
                        <td key={step} className="ws-tick ws-mono">
                          {count} / {m.assigned}
                        </td>
                      ))}
                      <td className="ws-num">
                        {hoursLabel(m.medianFirstCallHours) ?? "—"}
                        {m.firstCallSample > 0 ? ` (n=${m.firstCallSample})` : ""}
                      </td>
                      <td className="ws-num">{m.stalled > 0 ? <Tag tone="warn">{m.stalled}</Tag> : "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))" }}>
          {table.map((m) => {
            const mine = rows.filter((e) => e.mentorId === m.mentor.id && isLive(e));
            return (
              <Panel key={m.mentor.id} title={m.mentor.name} hint={`${mine.length} students · ${m.completed} finished`} flush>
                {mine.length === 0 ? (
                  <Empty>Nobody assigned.</Empty>
                ) : (
                  <div className="ws-scroll" style={{ maxHeight: "20rem" }}>
                    <table className="ws-table">
                      <tbody>
                        {mine.map((e, i) => (
                          <tr key={e.id}>
                            <td className="ws-rownum">{i + 1}</td>
                            <td style={{ width: "40%" }}>{e.fullName}</td>
                            <td className="ws-note ws-mono">
                              AIR {e.rank?.toLocaleString("en-IN") ?? "—"} · {CATEGORY_LABEL[e.category]}
                            </td>
                            <td className="ws-note ws-mono">{shortDate(e.assignedAt)}</td>
                            <td className="ws-tick">
                              <StepDots done={stepsOf(e.progress, KEYS)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
