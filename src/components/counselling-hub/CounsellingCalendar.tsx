"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { counsellingBySlug, counsellingProcesses } from "@/data/counselling";
import {
  calendarYear,
  counsellingCalendars,
  eventTypes,
  type CalendarEvent,
} from "@/data/counselling-calendar";
import { cn } from "@/lib/cn";
import { dayIndex, formatDay, formatRange, MONTHS_LONG } from "@/lib/format";
import { ease, spring } from "@/lib/motion";
import type { CounsellingSlug } from "@/types";

/* ------------------------------------------------------------------ */
/* Today (client only, so the static page never shows a stale status)  */
/* ------------------------------------------------------------------ */

const noop = () => () => {};
function useToday(): number | null {
  return useSyncExternalStore(
    noop,
    () => {
      const now = new Date();
      return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    },
    () => null,
  );
}

type Status =
  | { state: "unknown" }
  | { state: "done"; last: CalendarEvent }
  | { state: "upcoming"; next: CalendarEvent }
  | { state: "live"; current: CalendarEvent[]; next?: CalendarEvent };

const endOf = (e: CalendarEvent) => dayIndex(e.end ?? e.start);

function statusFor(events: CalendarEvent[], today: number | null): Status {
  if (today === null) return { state: "unknown" };
  const last = events.reduce((a, b) => (endOf(b) > endOf(a) ? b : a));
  if (today > endOf(last)) return { state: "done", last };
  const upcoming = events.filter((e) => dayIndex(e.start) > today).sort((a, b) => dayIndex(a.start) - dayIndex(b.start));
  const current = events.filter((e) => dayIndex(e.start) <= today && endOf(e) >= today);
  if (current.length === 0) return { state: "upcoming", next: upcoming[0] };
  return { state: "live", current, next: upcoming[0] };
}

/* ------------------------------------------------------------------ */

/** Status overview for every counselling plus a switchable calendar. */
export function CounsellingStatusBoard() {
  const [active, setActive] = useState<CounsellingSlug>("josaa");
  const today = useToday();

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {counsellingProcesses.map((p) => {
          const status = statusFor(counsellingCalendars[p.slug], today);
          const on = p.slug === active;
          return (
            <button
              key={p.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(p.slug)}
              style={{ "--c": p.theme.accent, "--ink": p.theme.ink } as React.CSSProperties}
              className={cn(
                "group relative overflow-hidden rounded-card p-4 text-left ring-1 transition-[box-shadow,transform,background-color] duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-0.5",
                on ? "bg-surface shadow-lift ring-[color-mix(in_oklab,var(--c)_45%,transparent)]" : "bg-surface/70 ring-line hover:bg-surface",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-0 h-1 origin-left bg-[linear-gradient(90deg,var(--c),transparent)] transition-transform duration-(--duration-slow)",
                  on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                )}
              />
              <span className="flex items-center justify-between gap-2">
                <span className="type-body font-semibold">{p.name}</span>
                <StatusPill status={status} />
              </span>
              <StatusLine status={status} />
            </button>
          );
        })}
      </div>

      <CounsellingCalendar slug={active} onSlugChange={setActive} today={today} />
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    unknown: { label: "Checking", cls: "bg-fg/[0.05] text-fg-muted" },
    done: { label: `${calendarYear} complete`, cls: "bg-fg/[0.06] text-fg-2" },
    upcoming: { label: "Upcoming", cls: "bg-info-soft text-info" },
    live: { label: "Live now", cls: "bg-success-soft text-success" },
  } as const;
  const s = map[status.state];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 type-meta", s.cls)}>
      {status.state === "live" && (
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
          <span className="size-1.5 rounded-full bg-current" />
        </span>
      )}
      {s.label}
    </span>
  );
}

function StatusLine({ status }: { status: Status }) {
  let label = "";
  let value = "";
  if (status.state === "done") {
    label = "Next";
    value = `${calendarYear + 1} dates not announced yet`;
  } else if (status.state === "upcoming") {
    label = `Next · ${formatDay(status.next.start)}`;
    value = status.next.title;
  } else if (status.state === "live") {
    label = status.next ? `Now · then ${formatDay(status.next.start)}` : "Now";
    value = status.current[0].title;
  }
  return (
    <span className="mt-3 block min-h-[2.75rem]">
      {status.state === "unknown" ? (
        <span className="block h-3 w-3/4 rounded-full skeleton" />
      ) : (
        <>
          <span className="block type-meta text-[var(--ink)]">{label}</span>
          <span className="mt-0.5 block type-body-sm text-fg-muted">{value}</span>
        </>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */

type CalendarProps = {
  slug: CounsellingSlug;
  /** Show counselling tabs when provided */
  onSlugChange?: (slug: CounsellingSlug) => void;
  today?: number | null;
  className?: string;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CounsellingCalendar({ slug, onSlugChange, today: todayProp, className }: CalendarProps) {
  const ownToday = useToday();
  const today = todayProp === undefined ? ownToday : todayProp;
  const process = counsellingBySlug[slug];
  const events = counsellingCalendars[slug];

  const months = useMemo(() => {
    const first = events.reduce((a, b) => (a.start < b.start ? a : b)).start;
    const last = events.reduce((a, b) => ((a.end ?? a.start) > (b.end ?? b.start) ? a : b));
    const [fy, fm] = first.split("-").map(Number);
    const [ly, lm] = (last.end ?? last.start).split("-").map(Number);
    const list: { y: number; m: number }[] = [];
    for (let k = fy * 12 + fm - 1; k <= ly * 12 + lm - 1; k++) list.push({ y: Math.floor(k / 12), m: (k % 12) + 1 });
    return list;
  }, [events]);

  const [view, setView] = useState({ slug, month: 0, dir: 0 });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [focusEvent, setFocusEvent] = useState<number | null>(null);

  // Reset when the counselling changes (derived during render, no effect needed)
  if (view.slug !== slug) {
    setView({ slug, month: 0, dir: 0 });
    setSelectedDay(null);
    setFocusEvent(null);
  }
  const monthIndex = Math.min(view.month, months.length - 1);
  const { y, m } = months[monthIndex];

  const goMonth = (delta: number) => {
    setView((v) => ({ ...v, month: Math.max(0, Math.min(months.length - 1, v.month + delta)), dir: delta }));
    setSelectedDay(null);
    setFocusEvent(null);
  };

  const monthStart = Math.floor(Date.UTC(y, m - 1, 1) / 86400000);
  const monthEnd = Math.floor(Date.UTC(y, m, 0) / 86400000);
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const cells = Array.from({ length: Math.ceil((lead + monthEnd - monthStart + 1) / 7) * 7 }, (_, i) => {
    const d = monthStart - lead + i;
    return d >= monthStart && d <= monthEnd ? d : null;
  });

  const indexed = events.map((e, i) => ({ ...e, i, s: dayIndex(e.start), t: endOf(e) }));
  const inMonth = indexed.filter((e) => e.s <= monthEnd && e.t >= monthStart).sort((a, b) => a.s - b.s || a.t - b.t);
  const listed = selectedDay === null ? inMonth : inMonth.filter((e) => e.s <= selectedDay && e.t >= selectedDay);
  const focused = focusEvent === null ? null : indexed[focusEvent];

  return (
    <div
      style={{ "--c": process.theme.accent, "--ink": process.theme.ink, "--g": process.theme.glow } as React.CSSProperties}
      className={cn("overflow-hidden rounded-panel bg-surface shadow-card", className)}
    >
      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-line p-4 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklab,var(--c)_10%,transparent),transparent_60%)] transition-colors duration-500"
        />
        {onSlugChange ? (
          <div role="tablist" aria-label="Counselling calendar" className="relative flex flex-wrap gap-1 rounded-full bg-fg/[0.05] p-1">
            {counsellingProcesses.map((p) => {
              const on = p.slug === slug;
              return (
                <button
                  key={p.slug}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => onSlugChange(p.slug)}
                  className={cn(
                    "relative h-9 rounded-full px-4 type-nav transition-colors duration-(--duration-base)",
                    on ? "text-white" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="calendar-tab"
                      transition={spring.pill}
                      className="absolute inset-0 rounded-full shadow-[0_6px_16px_-8px_var(--c)]"
                      style={{ background: `linear-gradient(140deg, ${p.theme.accent}, ${p.theme.glow})` }}
                    />
                  )}
                  <span className="relative">{p.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="relative inline-flex items-center gap-2 type-label text-[var(--ink)]">
            <Icon name="calendar-days" className="size-4" />
            {process.name} calendar
          </p>
        )}
        <p className="relative inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 type-caption text-fg-muted ring-1 ring-line">
          <Icon name="info" className="size-3.5" />
          {calendarYear} dates · {calendarYear + 1} dates appear once announced
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* Month grid */}
        <div className="border-line p-4 sm:p-6 lg:border-r">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="popLayout" initial={false} custom={view.dir}>
              <motion.h3
                key={`${slug}-${y}-${m}`}
                custom={view.dir}
                initial={{ opacity: 0, y: view.dir >= 0 ? 12 : -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: view.dir >= 0 ? -12 : 12 }}
                transition={{ duration: 0.28, ease: ease.out }}
                className="type-h4"
              >
                {MONTHS_LONG[m - 1]} <span className="text-fg-muted">{y}</span>
              </motion.h3>
            </AnimatePresence>
            <div className="flex items-center gap-1.5">
              <span className="mr-2 type-meta text-fg-muted tabular-nums">
                {monthIndex + 1}/{months.length}
              </span>
              <MonthButton label="Previous month" icon="chevron-left" disabled={monthIndex === 0} onClick={() => goMonth(-1)} />
              <MonthButton
                label="Next month"
                icon="chevron-right"
                disabled={monthIndex === months.length - 1}
                onClick={() => goMonth(1)}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center type-meta text-fg-subtle">
            {WEEKDAYS.map((d) => (
              <span key={d} aria-hidden>
                {d.slice(0, 1)}
                <span className="max-sm:hidden">{d.slice(1)}</span>
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${slug}-${y}-${m}`}
              initial={{ opacity: 0, x: view.dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: view.dir * -24 }}
              transition={{ duration: 0.26, ease: ease.out }}
              className="mt-2 grid grid-cols-7 gap-1"
            >
              {cells.map((d, ci) => {
                if (d === null) return <span key={`blank-${ci}`} aria-hidden />;
                const covering = inMonth.filter((e) => e.s <= d && e.t >= d);
                const starting = covering.filter((e) => e.s === d);
                const inFocus = focused ? focused.s <= d && focused.t >= d : false;
                const isSelected = selectedDay === d;
                const isToday = today === d;
                const tint = covering[0] ? eventTypes[covering[0].type].color : null;
                const dayNum = d - monthStart + 1;
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={covering.length === 0}
                    onClick={() => {
                      setSelectedDay(isSelected ? null : d);
                      setFocusEvent(null);
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${dayNum} ${MONTHS_LONG[m - 1]}${covering.length ? `, ${covering.length} event${covering.length > 1 ? "s" : ""}` : ""}`}
                    style={tint ? ({ "--t": focused ? eventTypes[focused.type].color : tint } as React.CSSProperties) : undefined}
                    className={cn(
                      "relative flex h-11 flex-col items-center justify-center rounded-xl sm:h-13 type-body-sm tabular-nums transition-[background-color,box-shadow,transform] duration-(--duration-fast)",
                      covering.length === 0 && "text-fg-subtle",
                      covering.length > 0 && "cursor-pointer font-medium text-fg hover:scale-[1.06]",
                      covering.length > 0 && !inFocus && "bg-[color-mix(in_oklab,var(--t)_9%,transparent)]",
                      inFocus && "bg-[color-mix(in_oklab,var(--t)_26%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--t)_55%,transparent)]",
                      isSelected && "bg-contrast! text-on-contrast ring-0",
                    )}
                  >
                    {isToday && <span className="absolute inset-0.5 rounded-[10px] ring-2 ring-[var(--c)]" aria-hidden />}
                    <span>{dayNum}</span>
                    {starting.length > 0 && (
                      <span className="absolute bottom-1.5 flex gap-0.5" aria-hidden>
                        {starting.slice(0, 3).map((e) => (
                          <span key={e.i} className="size-1.5 rounded-full" style={{ background: eventTypes[e.type].color }} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Legend">
            {Object.entries(eventTypes)
              .filter(([key]) => events.some((e) => e.type === key))
              .map(([key, t]) => (
                <li key={key} className="inline-flex items-center gap-1.5 type-caption text-fg-muted">
                  <span className="size-2 rounded-full" style={{ background: t.color }} />
                  {t.label}
                </li>
              ))}
          </ul>
        </div>

        {/* Event list */}
        <div className="flex max-h-[34rem] flex-col border-t border-line lg:border-t-0">
          <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
            <p className="type-label text-fg-muted">
              {selectedDay === null ? `${inMonth.length} events this month` : `On ${formatDay(new Date(selectedDay * 86400000).toISOString().slice(0, 10))}`}
            </p>
            {selectedDay !== null && (
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="rounded-full px-3 py-1 type-caption font-medium text-[var(--ink)] hover:bg-fg/[0.05]"
              >
                Show all
              </button>
            )}
          </div>
          <ol className="mt-3 flex-1 overflow-y-auto overscroll-contain px-2 pb-4 sm:px-4 sm:pb-6">
            <AnimatePresence initial={false} mode="popLayout">
              {listed.map((e, idx) => {
                const on = focusEvent === e.i;
                const past = today !== null && e.t < today;
                const now = today !== null && e.s <= today && e.t >= today;
                return (
                  <motion.li
                    key={`${slug}-${e.i}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: ease.out, delay: Math.min(idx, 8) * 0.025 }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setFocusEvent(e.i)}
                      onMouseLeave={() => setFocusEvent(null)}
                      onFocus={() => setFocusEvent(e.i)}
                      onBlur={() => setFocusEvent(null)}
                      className={cn(
                        "flex w-full gap-3 rounded-2xl p-3 text-left transition-colors duration-(--duration-fast)",
                        on ? "bg-fg/[0.045]" : "hover:bg-fg/[0.03]",
                      )}
                    >
                      <span
                        aria-hidden
                        className="mt-1 w-1 shrink-0 self-stretch rounded-full"
                        style={{ background: eventTypes[e.type].color }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="type-meta text-fg-muted tabular-nums">{formatRange(e.start, e.end)}</span>
                          {now && <span className="rounded-full bg-success-soft px-1.5 type-meta text-success">Now</span>}
                        </span>
                        <span className={cn("mt-0.5 block type-body-sm font-semibold", past && "text-fg-2")}>{e.title}</span>
                        {e.detail && <span className="mt-0.5 block type-caption text-fg-muted">{e.detail}</span>}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-line bg-surface-2/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="type-caption text-fg-muted">{process.nextCycle}</p>
        <a
          href={process.links.official}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 type-caption font-semibold text-[var(--ink)] hover:underline"
        >
          Official schedule
          <Icon name="arrow-up-right" className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function MonthButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: "chevron-left" | "chevron-right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full ring-1 ring-line transition-[background-color,transform] hover:bg-fg/[0.05] active:scale-90 disabled:opacity-35"
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}
