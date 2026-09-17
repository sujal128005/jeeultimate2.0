"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { facetCounts, filterColleges, FACETS, type ExplorerState, type Facet } from "@/lib/colleges/engine";
import type { College } from "@/lib/colleges/model";
import { BRANCHES, COUNSELLING, COURSES, INSTITUTE_TYPES, OWNERSHIP, QUOTAS } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Group = {
  facet: Facet;
  title: string;
  hint?: string;
  searchable?: boolean;
  options: (all: College[]) => { value: string; label: string; color?: string }[];
};

const uniq = (all: College[], pick: (c: College) => [string, string]) => {
  const map = new Map<string, string>();
  for (const c of all) {
    const [v, l] = pick(c);
    map.set(v, l);
  }
  return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => ({ value, label }));
};

const present = (all: College[], dict: Record<string, string>, key: "branches" | "courses" | "quotas" | "counselling") => {
  const used = new Set(all.flatMap((c) => c[key]));
  return Object.entries(dict)
    .filter(([v]) => used.has(v))
    .map(([value, label]) => ({ value, label }));
};

const GROUPS: Group[] = [
  {
    facet: "type",
    title: "Institute type",
    options: () =>
      Object.entries(INSTITUTE_TYPES).map(([value, t]) => ({ value, label: t.plural, color: t.color })),
  },
  { facet: "state", title: "State", searchable: true, options: (all) => uniq(all, (c) => [c.stateSlug, c.state]) },
  {
    facet: "city",
    title: "City",
    searchable: true,
    options: (all) => uniq(all, (c) => [c.citySlug, c.city]),
  },
  { facet: "branch", title: "Branch", searchable: true, options: (all) => present(all, BRANCHES, "branches") },
  { facet: "course", title: "Course", options: (all) => present(all, COURSES, "courses") },
  {
    facet: "category",
    title: "Category",
    hint: "Who runs the institute",
    options: (all) => {
      const used = new Set(all.map((c) => c.ownership));
      return Object.entries(OWNERSHIP)
        .filter(([v]) => used.has(v))
        .map(([value, label]) => ({ value, label }));
    },
  },
  { facet: "quota", title: "Quota", options: (all) => present(all, QUOTAS, "quotas") },
  { facet: "counselling", title: "Counselling", options: (all) => present(all, COUNSELLING, "counselling") },
];

const mq = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useDesktop = () => useSyncExternalStore(subscribe, () => window.matchMedia(mq).matches, () => true);

type Props = {
  open: boolean;
  onClose: () => void;
  all: College[];
  state: ExplorerState;
  onApply: (patch: Partial<ExplorerState>) => void;
};

export function FilterPanel({ open, onClose, all, state, onApply }: Props) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && <PanelBody key="panel" onClose={onClose} all={all} state={state} onApply={onApply} />}
    </AnimatePresence>,
    document.body,
  );
}

function PanelBody({ onClose, all, state, onApply }: Omit<Props, "open">) {
  const desktop = useDesktop();
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<ExplorerState>(state);
  const [openGroups, setOpenGroups] = useState<Set<Facet>>(
    () => new Set<Facet>(["type", "state", ...FACETS.filter((f) => state[f].length > 0)]),
  );
  const resultCount = useMemo(() => filterColleges(all, draft).length, [all, draft]);
  const draftCount = FACETS.reduce((n, f) => n + draft[f].length, 0);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const toggle = (facet: Facet, value: string) =>
    setDraft((d) => ({
      ...d,
      [facet]: d[facet].includes(value) ? d[facet].filter((v) => v !== value) : [...d[facet], value],
    }));

  const apply = () => {
    const patch: Partial<ExplorerState> = {};
    for (const f of FACETS) patch[f] = draft[f];
    onApply(patch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-(--z-modal)">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-contrast/30 backdrop-blur-[4px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        initial={desktop ? { x: "105%" } : { y: "100%" }}
        animate={desktop ? { x: 0 } : { y: 0 }}
        exit={desktop ? { x: "105%" } : { y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
        drag={desktop ? false : "y"}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
        className={cn(
          "absolute flex flex-col overflow-hidden bg-surface shadow-float",
          desktop
            ? "top-3 right-3 bottom-3 w-[27rem] rounded-panel ring-1 ring-line"
            : "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[1.75rem]",
        )}
      >
        <div
          onPointerDown={(e) => !desktop && dragControls.start(e)}
          className={cn("flex items-center justify-between gap-3 border-b border-line px-5 py-4", !desktop && "relative touch-none pt-6")}
        >
          {!desktop && <span aria-hidden className="absolute top-2.5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-fg/15" />}
          <div>
            <h2 id="filter-title" className="type-h4">
              Filters
            </h2>
            <p className="type-caption text-fg-muted">
              {draftCount ? `${draftCount} selected` : "Narrow down the list"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid size-10 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-fg/[0.05]"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-2">
          {GROUPS.map((g) => (
            <FilterGroup
              key={g.facet}
              group={g}
              all={all}
              draft={draft}
              open={openGroups.has(g.facet)}
              onToggleOpen={() =>
                setOpenGroups((s) => {
                  const n = new Set(s);
                  if (n.has(g.facet)) n.delete(g.facet);
                  else n.add(g.facet);
                  return n;
                })
              }
              onToggle={(v) => toggle(g.facet, v)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-line bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, ...Object.fromEntries(FACETS.map((f) => [f, []])) }))}
            disabled={draftCount === 0}
            className="h-12 rounded-full px-5 type-button text-fg-muted ring-1 ring-line transition-colors hover:text-fg disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={apply}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-contrast type-button text-on-contrast shadow-button transition-transform active:scale-[0.98]"
          >
            Apply
            <span className="rounded-full bg-on-contrast/12 px-2 py-0.5 type-meta tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={resultCount}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  className="inline-block"
                >
                  {resultCount}
                </motion.span>
              </AnimatePresence>{" "}
              colleges
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function FilterGroup({
  group,
  all,
  draft,
  open,
  onToggleOpen,
  onToggle,
}: {
  group: Group;
  all: College[];
  draft: ExplorerState;
  open: boolean;
  onToggleOpen: () => void;
  onToggle: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const options = useMemo(() => group.options(all), [group, all]);
  const counts = useMemo(() => facetCounts(all, draft, group.facet), [all, draft, group.facet]);
  const selected = draft[group.facet];
  const visible = options
    .filter((o) => !query || o.label.toLowerCase().includes(query.toLowerCase()))
    .filter((o) => (counts.get(o.value) ?? 0) > 0 || selected.includes(o.value) || group.facet === "type");
  const id = `fg-${group.facet}`;

  return (
    <section className="border-b border-line last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggleOpen}
          className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-3.5 text-left"
        >
          <span>
            <span className="type-body font-semibold">{group.title}</span>
            {group.hint && <span className="ml-2 type-caption text-fg-subtle">{group.hint}</span>}
          </span>
          <span className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 type-meta text-accent-text tabular-nums">{selected.length}</span>
            )}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring.toggle} className="text-fg-muted">
              <Icon name="chevron-down" className="size-4" />
            </motion.span>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: ease.out }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-4">
              {group.searchable && options.length > 8 && (
                <label className="mb-2 flex h-10 items-center gap-2 rounded-xl bg-surface-2/70 px-3 ring-1 ring-line focus-within:ring-accent/60">
                  <Icon name="search" className="size-3.5 text-fg-muted" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Find a ${group.title.toLowerCase()}`}
                    aria-label={`Find a ${group.title.toLowerCase()}`}
                    className="h-full min-w-0 flex-1 bg-transparent type-body-sm outline-none placeholder:text-fg-subtle"
                  />
                </label>
              )}
              <ul className={cn("grid gap-0.5", options.length > 10 && "max-h-64 overflow-y-auto overscroll-contain pr-1")}>
                {visible.length === 0 && <li className="px-2 py-3 type-caption text-fg-muted">Nothing matches.</li>}
                {visible.map((o) => {
                  const n = counts.get(o.value) ?? 0;
                  const on = selected.includes(o.value);
                  const disabled = n === 0 && !on;
                  return (
                    <li key={o.value}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--focus-ring)",
                          on ? "bg-accent-soft/60" : "hover:bg-fg/[0.03]",
                          disabled && "cursor-not-allowed opacity-45",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={on}
                          disabled={disabled}
                          onChange={() => onToggle(o.value)}
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-md transition-colors",
                            on ? "bg-contrast text-on-contrast" : "ring-1 ring-line-strong ring-inset",
                          )}
                        >
                          {on && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.toggle}>
                              <Icon name="check" className="size-3.5" strokeWidth={3} />
                            </motion.span>
                          )}
                        </span>
                        {o.color && <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: o.color }} />}
                        <span className="min-w-0 flex-1 truncate type-body-sm">{o.label}</span>
                        <span className="type-meta text-fg-subtle tabular-nums">{n}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
