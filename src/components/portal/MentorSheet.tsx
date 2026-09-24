"use client";

import { useMemo, useState } from "react";
import { PROGRESS_STEPS } from "@/config/progress";
import { Tag, hoursSince, shortDate } from "@/components/portal/parts";
import { CATEGORY_LABEL, GENDER_LABEL, type Enrolment, type Progress } from "@/lib/workspace/types";

type SortKey = "name" | "rank" | "assigned" | "done" | "waiting";

/**
 * A mentor's whole list as one worksheet: the students down the left, the four
 * things to do as columns on the right. Tick a box and it saves, the way a
 * clerk would tick a column and move on.
 */
export function MentorSheet({ rows, canEdit }: { rows: Enrolment[]; canEdit: boolean }) {
  const [local, setLocal] = useState<Record<string, Progress>>(() => Object.fromEntries(rows.map((r) => [r.id, r.progress])));
  const [busy, setBusy] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "assigned", dir: -1 });
  const [onlyOpen, setOnlyOpen] = useState(false);

  const progressOf = (row: Enrolment) => local[row.id] ?? row.progress;
  const doneCount = (row: Enrolment) => PROGRESS_STEPS.filter((s) => progressOf(row)[s.key] !== null).length;
  const waitingHours = (row: Enrolment) => (row.assignedAt && !progressOf(row).firstCallAt ? hoursSince(row.assignedAt) : 0);

  const view = useMemo(() => {
    const list = onlyOpen ? rows.filter((r) => doneCount(r) < PROGRESS_STEPS.length) : rows;
    const value = (r: Enrolment) => {
      switch (sort.key) {
        case "name":
          return r.fullName.toLowerCase();
        case "rank":
          return r.rank ?? Number.MAX_SAFE_INTEGER;
        case "done":
          return doneCount(r);
        case "waiting":
          return waitingHours(r);
        default:
          return r.assignedAt ?? "";
      }
    };
    return [...list].sort((a, b) => {
      const x = value(a);
      const y = value(b);
      if (x === y) return a.fullName.localeCompare(b.fullName);
      return (x > y ? 1 : -1) * sort.dir;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, local, sort, onlyOpen]);

  const tick = async (row: Enrolment, key: keyof Progress, done: boolean) => {
    if (!canEdit || busy) return;
    if (!done && !window.confirm("Clear this step? The date it was done will be lost.")) return;
    const cellId = `${row.id}:${key}`;
    setBusy(cellId);
    const before = progressOf(row);
    setLocal((prev) => ({ ...prev, [row.id]: { ...before, [key]: done ? new Date().toISOString() : null } }));
    try {
      const res = await fetch("/api/portal/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: row.id, key, done }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setLocal((prev) => ({ ...prev, [row.id]: before }));
    } finally {
      setBusy(null);
    }
  };

  const head = (key: SortKey, label: string, extra = "") => (
    <th
      className={`ws-sortable ${extra}`}
      onClick={() => setSort((s) => ({ key, dir: s.key === key ? ((s.dir * -1) as 1 | -1) : 1 }))}
      title="Click to sort"
    >
      {label}
      {sort.key === key ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
    </th>
  );

  const finished = rows.filter((r) => doneCount(r) === PROGRESS_STEPS.length).length;

  return (
    <>
      <div className="ws-toolbar" style={{ borderBottom: 0 }}>
        <span className="ws-toolbar-label">Sheet</span>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
          Hide finished students
        </label>
        <span className="ws-note">Click a column heading to sort. Tick a box and it saves at once.</span>
        <span style={{ marginLeft: "auto" }} className="ws-note ws-mono">
          {view.length} shown · {finished} finished · {rows.length} total
        </span>
      </div>

      <div className="ws-scroll">
        <table className="ws-table">
          <thead>
            <tr>
              <th className="ws-rownum">#</th>
              {head("name", "Student", "ws-freeze")}
              {head("rank", "AIR")}
              <th>Category</th>
              <th>Gender</th>
              <th>State</th>
              <th>Counselling</th>
              <th>Phone</th>
              {head("assigned", "Assigned")}
              {head("waiting", "No call for")}
              {PROGRESS_STEPS.map((s) => (
                <th key={s.key} className="ws-tick" title={s.label}>
                  {s.short}
                </th>
              ))}
              {head("done", "Done", "ws-tick")}
            </tr>
          </thead>
          <tbody>
            {view.map((row, i) => {
              const p = progressOf(row);
              const done = doneCount(row);
              const waiting = waitingHours(row);
              return (
                <tr key={row.id} className={waiting > 24 ? "ws-row-flag" : undefined}>
                  <td className="ws-rownum">{i + 1}</td>
                  <td className="ws-freeze ws-strong">{row.fullName}</td>
                  <td className="ws-num">{row.rank?.toLocaleString("en-IN") ?? "—"}</td>
                  <td>{CATEGORY_LABEL[row.category]}</td>
                  <td>{GENDER_LABEL[row.gender]}</td>
                  <td>{row.homeState ?? "—"}</td>
                  <td>{row.counselling ?? "—"}</td>
                  <td className="ws-mono">{row.phone ?? "—"}</td>
                  <td className="ws-mono">{shortDate(row.assignedAt)}</td>
                  <td className="ws-num">{waiting > 24 ? `${Math.round(waiting / 24)} d` : "—"}</td>
                  {PROGRESS_STEPS.map((step) => {
                    const at = p[step.key];
                    return (
                      <td key={step.key} className="ws-tick">
                        <input
                          type="checkbox"
                          checked={at !== null}
                          disabled={!canEdit || busy !== null}
                          aria-label={`${step.label} for ${row.fullName}`}
                          onChange={(e) => tick(row, step.key, e.target.checked)}
                        />
                        <span className="ws-tick-date">{at ? shortDate(at) : ""}</span>
                      </td>
                    );
                  })}
                  <td className="ws-tick">
                    <Tag tone={done === 4 ? "ok" : done > 0 ? "sel" : "warn"}>{done}/4</Tag>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
