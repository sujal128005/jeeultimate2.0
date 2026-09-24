import { PROGRESS_STEPS } from "@/config/progress";
import { BarRow, BarTable, DayBars, Empty, Panel, Readout, Readouts, hoursLabel } from "@/components/portal/parts";
import { Filters } from "@/components/portal/Filters";
import { Shell } from "@/components/portal/Shell";
import { requireSession } from "@/lib/workspace/auth";
import { filtersFromParams } from "@/lib/workspace/query";
import { read } from "@/lib/workspace/store";
import {
  applyFilters,
  categorySplit,
  counsellingSplit,
  dailyCounts,
  funnel,
  genderSplit,
  headline,
  isLive,
  mentorTable,
  rankHistogram,
  revenueBreakdown,
  rupees,
  streamCounts,
} from "@/lib/workspace/stats";
import { CATEGORY_LABEL, GENDER_LABEL } from "@/lib/workspace/types";

export const dynamic = "force-dynamic";

export default async function OverviewPage(props: PageProps<"/portal/overview">) {
  const session = await requireSession(["OWNER", "MANAGER", "ANALYST"]);
  const params = await props.searchParams;
  const db = await read();

  const filters = filtersFromParams(params);
  const rows = applyFilters(db.enrolments, filters);
  const h = headline(rows);
  const money = revenueBreakdown(rows);
  const mentors = mentorTable(db, rows);
  const days = Number(Array.isArray(params.days) ? params.days[0] : params.days) || 30;
  const series = dailyCounts(rows, Math.min(90, days));
  const period = filters.from ? `last ${days} days` : "all time";

  const cats = categorySplit(rows, CATEGORY_LABEL);
  const genders = genderSplit(rows, GENDER_LABEL);
  // Across all four, whichever tab is open: this panel is the season at a glance.
  const counsellings = counsellingSplit(db.enrolments);
  const ranks = rankHistogram(rows);
  const steps = funnel(rows);
  const stepTotals = PROGRESS_STEPS.map((s) => rows.filter((e) => isLive(e) && e.progress[s.key] !== null).length);

  const mentorNames = db.users.filter((u) => u.role === "MENTOR" && u.active).map((u) => ({ id: u.id, name: u.name }));
  const unread = db.messages.filter((m) => (m.toId === null || m.toId === session.id) && !m.readBy.includes(session.id)).length;

  const max = (list: { count: number }[]) => Math.max(1, ...list.map((x) => x.count));

  return (
    <Shell session={session} streamCounts={streamCounts(db.enrolments)}
      noData={db.enrolments.length === 0} unassigned={h.unassigned} unread={unread} status={`Showing ${h.total} students · ${period}`}>
      <div className="ws-grid">
        <Filters mentors={mentorNames} />

        <Readouts>
          <Readout label="Enrolled" value={h.total.toLocaleString("en-IN")} sub={period} />
          <Readout
            label="Assigned"
            value={h.assigned.toLocaleString("en-IN")}
            sub={`${h.total ? Math.round((h.assigned / h.total) * 100) : 0}% of enrolled`}
            tone="ok"
          />
          <Readout
            label="Waiting"
            value={h.unassigned.toLocaleString("en-IN")}
            sub="no mentor yet"
            tone={h.unassigned ? "warn" : undefined}
          />
          <Readout label="Completed" value={h.completed.toLocaleString("en-IN")} sub="all four steps" />
          <Readout label="Collected" value={rupees(h.revenuePaise)} sub="excludes refunds" />
          <Readout
            label="Pay → mentor"
            value={hoursLabel(h.medianAssignHours)}
            sub={h.assignSample ? `median of ${h.assignSample}` : "nothing assigned"}
          />
        </Readouts>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)" }}>
          <Panel
            title="Enrolments per day"
            hint={`${series.length} days · highest ${Math.max(0, ...series.map((s) => s.count))}`}
          >
            {series.some((s) => s.count > 0) ? (
              <>
                <DayBars data={series} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }} className="ws-note ws-mono">
                  <span>{new Date(series[0].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  <span>
                    {new Date(series[series.length - 1].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </>
            ) : (
              <Empty>No payments in this period.</Empty>
            )}
          </Panel>

          <Panel title="Money" hint={period} flush>
            <table className="ws-table">
              <tbody>
                <tr>
                  <td>Collected, all shown</td>
                  <td className="ws-num ws-strong">{rupees(money.total)}</td>
                </tr>
                <tr>
                  <td>Last 7 days</td>
                  <td className="ws-num">{rupees(money.week)}</td>
                </tr>
                <tr>
                  <td>Last 30 days</td>
                  <td className="ws-num">{rupees(money.month)}</td>
                </tr>
                <tr>
                  <td>Refunded</td>
                  <td className="ws-num">{money.refundedPaise ? rupees(money.refundedPaise) : "—"}</td>
                </tr>
                {money.byPlan.map((p) => (
                  <tr key={p.code}>
                    <td className="ws-note">{p.code}</td>
                    <td className="ws-num ws-note">
                      {p.count} · {rupees(p.paise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(19rem, 1fr))" }}>
          <Panel title="Category" hint={`${h.total} students`} flush>
            <BarTable>
              {cats.map((c) => (
                <BarRow key={c.key} label={c.label} count={c.count} percent={c.percent} max={max(cats)} />
              ))}
            </BarTable>
          </Panel>

          <Panel title="Gender" hint={`${h.total} students`} flush>
            <BarTable>
              {genders.map((g) => (
                <BarRow key={g.key} label={g.label} count={g.count} percent={g.percent} max={max(genders)} />
              ))}
            </BarTable>
          </Panel>

          <Panel title="Rank spread" hint="All India Rank" flush>
            <BarTable>
              {ranks.map((r) => (
                <BarRow key={r.label} label={r.label} count={r.count} max={max(ranks)} />
              ))}
            </BarTable>
          </Panel>

          <Panel title="Counselling" hint="all four, whichever tab is open" flush>
            <BarTable>
              {counsellings.map((c) => (
                <BarRow key={c.key} label={c.label} count={c.count} percent={c.percent} max={max(counsellings)} />
              ))}
            </BarTable>
          </Panel>
        </div>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(19rem, 1fr))" }}>
          <Panel title="Paid to finished" hint="where people stop" flush>
            <table className="ws-table">
              <tbody>
                {steps.map((s, i) => (
                  <tr key={s.label}>
                    <td style={{ width: "40%" }}>{s.label}</td>
                    <td className="ws-num ws-strong">{s.count}</td>
                    <td className="ws-note">
                      {s.lost !== null && s.lost > 0 ? `${s.lost} stop before ${steps[i + 1].label.toLowerCase()}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Work done, all mentors" hint="students reaching each step" flush>
            <BarTable>
              {PROGRESS_STEPS.map((s, i) => (
                <BarRow
                  key={s.key}
                  label={s.label}
                  count={stepTotals[i]}
                  percent={h.total ? Math.round((stepTotals[i] / h.total) * 100) : 0}
                  max={Math.max(1, ...stepTotals)}
                />
              ))}
            </BarTable>
          </Panel>

          <Panel title="Load per mentor" hint="students assigned now" flush>
            {mentors.length ? (
              <BarTable>
                {mentors.map((m) => (
                  <BarRow
                    key={m.mentor.id}
                    label={m.mentor.name}
                    count={m.assigned}
                    max={Math.max(1, ...mentors.map((x) => x.assigned))}
                    suffix={m.stalled ? `${m.stalled} stalled` : ""}
                  />
                ))}
              </BarTable>
            ) : (
              <Empty>No mentors yet.</Empty>
            )}
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
