import Link from "next/link";
import { PROGRESS_STEPS } from "@/config/progress";
import { Empty, Panel, StepDots, Tag, shortDate, stepsOf } from "@/components/portal/parts";
import { Filters } from "@/components/portal/Filters";
import { Shell } from "@/components/portal/Shell";
import { requireSession } from "@/lib/workspace/auth";
import { filtersFromParams, paramString } from "@/lib/workspace/query";
import { read } from "@/lib/workspace/store";
import {
  applyFilters,
  isLive,
  rupees,
  streamCounts,
} from "@/lib/workspace/stats";
import { CATEGORY_LABEL, GENDER_LABEL, STATUS_LABEL, type EnrolStatus } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

const PAGE = 50;

const KEYS = PROGRESS_STEPS.map((s) => s.key);

const TONE: Record<EnrolStatus, "ok" | "warn" | "bad" | "sel" | undefined> = {
  PAID: "warn",
  ASSIGNED: "sel",
  IN_PROGRESS: "sel",
  COMPLETED: "ok",
  REFUNDED: "bad",
  CANCELLED: "bad",
};

export default async function StudentsPage(props: PageProps<"/portal/students">) {
  const session = await requireSession(["OWNER", "MANAGER", "ANALYST"]);
  const params = await props.searchParams;
  const db = await read();

  const filters = filtersFromParams(params);
  const all = applyFilters(db.enrolments, filters).sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  const page = Math.max(1, Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1);
  const pages = Math.max(1, Math.ceil(all.length / PAGE));
  const rows = all.slice((page - 1) * PAGE, page * PAGE);

  const mentorName = (id: string | null) => (id ? (db.users.find((u) => u.id === id)?.name ?? "—") : "—");
  const mentors = db.users.filter((u) => u.role === "MENTOR" && u.active).map((u) => ({ id: u.id, name: u.name }));
  const query = paramString(params);
  const pageHref = (n: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(n));
    return `/portal/students?${next.toString()}`;
  };

  const unread = db.messages.filter((m) => (m.toId === null || m.toId === session.id) && !m.readBy.includes(session.id)).length;

  return (
    <Shell
      session={session}
      streamCounts={streamCounts(db.enrolments)}
      noData={db.enrolments.length === 0}
      unassigned={db.enrolments.filter((e) => isLive(e) && !e.mentorId).length}
      unread={unread}
      status={`${all.length.toLocaleString("en-IN")} rows · page ${page} of ${pages}`}
    >
      <div className="ws-grid">
        <Filters mentors={mentors} showSearch />

        <Panel
          title="Students"
          flush
          right={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="ws-panel-hint">
                {all.length.toLocaleString("en-IN")} rows · page {page} of {pages}
              </span>
              <a className="ws-btn" style={{ height: 20, fontSize: 11 }} href={`/api/portal/export${query ? `?${query}` : ""}`}>
                Export CSV
              </a>
            </span>
          }
        >
          {rows.length === 0 ? (
            <Empty>Nothing matches these filters.</Empty>
          ) : (
            <div className="ws-scroll">
              <table className="ws-table">
                <thead>
                  <tr>
                    <th className="ws-rownum">#</th>
                    <th className="ws-freeze">Name</th>
                    <th>Paid</th>
                    <th style={{ textAlign: "right" }}>AIR</th>
                    <th>Category</th>
                    <th>Gender</th>
                    <th>State</th>
                    <th>Counselling</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Status</th>
                    <th>Mentor</th>
                    <th className="ws-tick">Steps</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e, i) => (
                    <tr key={e.id}>
                      <td className="ws-rownum">{(page - 1) * PAGE + i + 1}</td>
                      <td className="ws-freeze ws-strong">
                        {e.fullName}
                        {e.manualEntry ? <span className="ws-note"> (manual)</span> : null}
                      </td>
                      <td className="ws-mono">{shortDate(e.paidAt)}</td>
                      <td className="ws-num">{e.rank?.toLocaleString("en-IN") ?? "—"}</td>
                      <td>{CATEGORY_LABEL[e.category]}</td>
                      <td>{GENDER_LABEL[e.gender]}</td>
                      <td>{e.homeState ?? "—"}</td>
                      <td>{e.counselling ?? "—"}</td>
                      <td className="ws-num">{rupees(e.amountPaise)}</td>
                      <td>
                        <Tag tone={TONE[e.status]}>{STATUS_LABEL[e.status]}</Tag>
                      </td>
                      <td>{mentorName(e.mentorId)}</td>
                      <td className="ws-tick">
                        <StepDots done={stepsOf(e.progress, KEYS)} />
                      </td>
                      <td className="ws-mono">{e.phone ?? "—"}</td>
                      <td className="ws-mono">{e.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div className="ws-toolbar" style={{ borderLeft: 0, borderRight: 0, borderBottom: 0 }}>
              <span className="ws-note ws-mono">
                {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, all.length)} of {all.length}
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                {page > 1 && (
                  <Link className="ws-btn" href={pageHref(page - 1)}>
                    ← Previous
                  </Link>
                )}
                {page < pages && (
                  <Link className="ws-btn" href={pageHref(page + 1)}>
                    Next →
                  </Link>
                )}
              </span>
            </div>
          )}
        </Panel>
      </div>
    </Shell>
  );
}
