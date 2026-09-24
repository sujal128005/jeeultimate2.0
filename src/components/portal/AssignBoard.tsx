"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tag, ago, hoursLabel, hoursSince } from "@/components/portal/parts";
import { CATEGORY_LABEL, GENDER_LABEL, type Enrolment } from "@/lib/workspace/types";

type Mentor = { id: string; name: string; load: number };

/**
 * The board that replaced the chat-group handover.
 *
 * Two people work it at the same time, so the server decides every move. Each
 * card carries the timestamp it was drawn with; if someone else moved that
 * student first, the server says so and only that card corrects itself.
 */
export function AssignBoard({
  initialQueue,
  initialAssigned,
  mentors,
}: {
  initialQueue: Enrolment[];
  initialAssigned: Record<string, Enrolment[]>;
  mentors: Mentor[];
}) {
  const router = useRouter();
  const queue = initialQueue;
  const columns = initialAssigned;
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<string[] | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "warn"; text: string } | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  // The other admin's work should appear without anyone pressing reload.
  useEffect(() => {
    const tick = () => router.refresh();
    const id = window.setInterval(tick, 10_000);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", tick);
    };
  }, [router]);

  const say = useCallback((tone: "ok" | "warn", text: string) => {
    setNotice({ tone, text });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(null), 6000);
  }, []);

  const allRows = useCallback(() => [...queue, ...Object.values(columns).flat()], [queue, columns]);

  const move = useCallback(
    async (ids: string[], mentorId: string | null, confirmReassign = false) => {
      if (!ids.length || busy) return;
      setBusy(true);
      const rows = allRows();
      const seen: Record<string, string> = {};
      for (const id of ids) {
        const row = rows.find((r) => r.id === id);
        if (row) seen[id] = row.updatedAt;
      }

      try {
        const res = await fetch("/api/portal/assign", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids, mentorId, seen, confirmReassign }),
        });
        const data = (await res.json()) as {
          changed?: Enrolment[];
          clashes?: { row: Enrolment; heldBy: string | null }[];
          error?: string;
        };

        if (data.error) {
          say("warn", "That mentor is not available any more.");
          return;
        }
        const clash = data.clashes?.[0];
        if (clash) {
          say(
            "warn",
            clash.heldBy
              ? `${clash.row.fullName} is already with ${clash.heldBy}. Use the card's Move button to change that.`
              : `${clash.row.fullName} changed a moment ago. The board has been refreshed.`,
          );
        }
        if (data.changed?.length) {
          const name = mentors.find((m) => m.id === mentorId)?.name;
          const who = data.changed.length === 1 ? data.changed[0].fullName : `${data.changed.length} students`;
          say("ok", mentorId ? `${who} assigned to ${name}` : `${who} returned to the queue`);
        }
        setPicked(new Set());
        router.refresh();
      } catch {
        say("warn", "Could not reach the server. Nothing was changed.");
      } finally {
        setBusy(false);
        setMenuFor(null);
      }
    },
    [allRows, busy, mentors, router, say],
  );

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const startDrag = (id: string) => setDragging(picked.has(id) ? Array.from(picked) : [id]);

  const drop = (mentorId: string | null) => {
    if (!dragging) return;
    const fromColumn = Object.values(columns)
      .flat()
      .some((r) => dragging.includes(r.id));
    void move(dragging, mentorId, fromColumn && mentorId !== null);
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="ws-grid">
      <div className="ws-toolbar">
        <span className="ws-toolbar-label">Assign</span>
        <span className="ws-note">Drag a card onto a mentor, or use the card&apos;s Move button. Both do the same thing.</span>
        <span style={{ marginLeft: "auto" }} className="ws-note">
          {picked.size > 0 ? `${picked.size} selected · ` : ""}list refreshes every 10 seconds
        </span>
        {picked.size > 0 && (
          <button type="button" className="ws-btn" onClick={() => setPicked(new Set())}>
            Clear selection
          </button>
        )}
      </div>

      {notice && (
        <p
          role="status"
          className={`ws-tag ws-tag-${notice.tone === "ok" ? "ok" : "warn"}`}
          style={{ display: "block", padding: "5px 8px" }}
        >
          {notice.text}
        </p>
      )}

      {picked.size > 0 && (
        <div className="ws-toolbar">
          <span className="ws-toolbar-label">Assign {picked.size} selected to</span>
          {mentors.map((m) => (
            <button
              key={m.id}
              type="button"
              className="ws-btn"
              disabled={busy}
              onClick={() => move(Array.from(picked), m.id, true)}
            >
              {m.name}
            </button>
          ))}
          <button type="button" className="ws-btn" disabled={busy} onClick={() => move(Array.from(picked), null)}>
            Back to queue
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "minmax(0,20rem) minmax(0,1fr)" }}>
        <section
          onDragOver={(e) => {
            if (dragging) {
              e.preventDefault();
              setOver("QUEUE");
            }
          }}
          onDragLeave={() => setOver((o) => (o === "QUEUE" ? null : o))}
          onDrop={() => drop(null)}
          className={`ws-panel${over === "QUEUE" ? " ws-dropzone" : ""}`}
        >
          <div className="ws-panel-head">
            <span className="ws-panel-title">Waiting for a mentor</span>
            <span className="ws-panel-hint ws-mono">{queue.length}</span>
          </div>
          <div className="ws-scroll" style={{ padding: 6, display: "grid", gap: 4 }}>
            {queue.length === 0 && <p className="ws-empty">Nobody is waiting.</p>}
            {queue.map((row) => (
              <Card
                key={row.id}
                row={row}
                mentors={mentors}
                picked={picked.has(row.id)}
                onPick={() => toggle(row.id)}
                onDragStart={() => startDrag(row.id)}
                onDragEnd={() => setDragging(null)}
                menuOpen={menuFor === row.id}
                onMenu={() => setMenuFor((id) => (id === row.id ? null : row.id))}
                onChoose={(mentorId) => move([row.id], mentorId)}
                busy={busy}
              />
            ))}
          </div>
        </section>

        <div
          style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", alignContent: "start" }}
        >
          {mentors.map((mentor) => {
            const rows = columns[mentor.id] ?? [];
            return (
              <section
                key={mentor.id}
                onDragOver={(e) => {
                  if (dragging) {
                    e.preventDefault();
                    setOver(mentor.id);
                  }
                }}
                onDragLeave={() => setOver((o) => (o === mentor.id ? null : o))}
                onDrop={() => drop(mentor.id)}
                className={`ws-panel${over === mentor.id ? " ws-dropzone" : ""}`}
              >
                <div className="ws-panel-head">
                  <span className="ws-panel-title">{mentor.name}</span>
                  <span className="ws-panel-hint ws-mono">{rows.length}</span>
                </div>
                <div className="ws-scroll" style={{ padding: 6, display: "grid", gap: 4 }}>
                  {rows.length === 0 && <p className="ws-empty">Drop a student here.</p>}
                  {rows.map((row) => (
                    <Card
                      key={row.id}
                      row={row}
                      mentors={mentors}
                      compact
                      picked={picked.has(row.id)}
                      onPick={() => toggle(row.id)}
                      onDragStart={() => startDrag(row.id)}
                      onDragEnd={() => setDragging(null)}
                      menuOpen={menuFor === row.id}
                      onMenu={() => setMenuFor((id) => (id === row.id ? null : row.id))}
                      onChoose={(mentorId) => move([row.id], mentorId, mentorId !== null)}
                      busy={busy}
                      currentMentorId={mentor.id}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Card({
  row,
  mentors,
  picked,
  compact,
  busy,
  menuOpen,
  currentMentorId,
  onPick,
  onDragStart,
  onDragEnd,
  onMenu,
  onChoose,
}: {
  row: Enrolment;
  mentors: Mentor[];
  picked: boolean;
  compact?: boolean;
  busy: boolean;
  menuOpen: boolean;
  currentMentorId?: string;
  onPick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMenu: () => void;
  onChoose: (mentorId: string | null) => void;
}) {
  const waited = hoursSince(row.paidAt);
  const late = !row.mentorId && waited > 12;

  return (
    <div
      draggable={!busy}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", row.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`ws-card${late ? " ws-card-late" : ""}${picked ? " ws-card-picked" : ""}`}
      style={{ position: "relative", cursor: busy ? "default" : "grab" }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
        <input type="checkbox" checked={picked} onChange={onPick} aria-label={`Select ${row.fullName}`} />
        <span
          className="ws-strong"
          style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.fullName}
        </span>
        <button
          type="button"
          className="ws-btn"
          style={{ height: 18, fontSize: 11, padding: "0 6px" }}
          onClick={onMenu}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          Move
        </button>
      </div>
      <div className="ws-note ws-mono" style={{ marginTop: 2 }}>
        AIR {row.rank?.toLocaleString("en-IN") ?? "—"} · {CATEGORY_LABEL[row.category]} · {GENDER_LABEL[row.gender]}
      </div>
      {!compact && (
        <div className="ws-note ws-mono">
          {row.homeState ?? "state n/a"} · {row.counselling ?? "counselling n/a"} · ₹
          {Math.round(row.amountPaise / 100).toLocaleString("en-IN")}
        </div>
      )}
      <div style={{ marginTop: 3 }}>
        {late ? <Tag tone="warn">waiting {hoursLabel(waited)}</Tag> : <Tag>{ago(row.paidAt)}</Tag>}
      </div>

      {menuOpen && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 4,
            top: 24,
            zIndex: 20,
            width: 170,
            background: "#fff",
            border: "1px solid var(--ws-line)",
            boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
          }}
        >
          {mentors.map((m) => (
            <button
              key={m.id}
              type="button"
              role="menuitem"
              disabled={busy || m.id === currentMentorId}
              onClick={() => onChoose(m.id)}
              className="ws-btn"
              style={{
                width: "100%",
                justifyContent: "space-between",
                border: 0,
                borderBottom: "1px solid var(--ws-line-soft)",
                background: "#fff",
              }}
            >
              {m.name}
              {m.id === currentMentorId && <span className="ws-note">current</span>}
            </button>
          ))}
          {row.mentorId && (
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => onChoose(null)}
              className="ws-btn"
              style={{ width: "100%", border: 0, background: "#fff", color: "var(--ws-warn)" }}
            >
              Back to the queue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
