"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useShortlist } from "@/lib/colleges/store";
import { Icon } from "@/components/ui/Icon";
import {
  activeFilterCount,
  facetCounts,
  regionCounts,
} from "@/lib/colleges/engine";
import {
  BRANCHES,
  COUNSELLING,
  COURSES,
  INSTITUTE_TYPES,
  OWNERSHIP,
  QUOTAS,
  REGIONS,
  type Region,
} from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { applySuggestion } from "./applySuggestion";
import { CollegeSearch } from "./CollegeSearch";
import { MapPicker } from "./IndiaMap";
import { SortMenu } from "./SortMenu";
import type { Explorer } from "./useExplorer";

type Props = { explorer: Explorer; onOpenFilters: () => void };

/** Sticky toolbar: search, filters, sort, view, count, regions and active chips. */
export const ExplorerToolbar = forwardRef<HTMLInputElement, Props>(function ExplorerToolbar({ explorer, onOpenFilters }, ref) {
  const { state, results, update } = explorer;
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const count = activeFilterCount(state) - (state.region ? 1 : 0);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-69px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <div
        className={cn(
          "sticky top-[68px] z-30 -mx-gutter px-gutter transition-[background-color,box-shadow,backdrop-filter] duration-(--duration-base)",
          stuck
            ? "bg-[color-mix(in_oklab,var(--canvas)_86%,transparent)] shadow-[0_1px_0_var(--line)] backdrop-blur-glass backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        <div className="flex flex-wrap items-center gap-2 py-3">
          <CollegeSearch
            ref={ref}
            size="sm"
            value={state.q}
            onChange={(q) => update({ q })}
            onSubmit={(q) => update({ q })}
            onPick={(s) => applySuggestion(update, s)}
            placeholder="Search colleges..."
            className="w-full sm:w-72 lg:w-80"
          />
          <button
            type="button"
            onClick={onOpenFilters}
            aria-haspopup="dialog"
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full pr-3 pl-3.5 type-nav ring-1 transition-colors",
              count ? "bg-contrast text-on-contrast ring-contrast" : "bg-surface ring-line hover:ring-line-strong",
            )}
          >
            <Icon name="settings" className="size-4" />
            <span className="font-semibold">Filters</span>
            {count > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1 type-meta text-on-accent tabular-nums">
                {count}
              </span>
            )}
            <Icon name="chevron-down" className="size-3.5" />
          </button>
          <SortMenu value={state.sort} onChange={(sort) => update({ sort })} />
          <ViewToggle value={state.view} onChange={(view) => update({ view })} />
          <ShortlistLink />
          <p className="ml-auto type-body-sm text-fg-muted" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={results.length}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.22, ease: ease.out }}
                className="inline-block font-semibold text-fg tabular-nums"
              >
                {results.length}
              </motion.span>{" "}
              {results.length === 1 ? "college" : "colleges"}
            </AnimatePresence>
          </p>
        </div>
        <RegionBar explorer={explorer} />
        <ActiveChips explorer={explorer} />
      </div>
    </>
  );
});

function ShortlistLink() {
  const { saved } = useShortlist();
  return (
    <Link
      href="/colleges/shortlist"
      className="inline-flex h-10 items-center gap-2 rounded-full bg-surface pr-3 pl-3.5 type-nav ring-1 ring-line transition-colors hover:ring-line-strong"
    >
      <Icon name="heart" className={cn("size-4", saved.length ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-fg-muted")} />
      <span className="font-semibold max-sm:sr-only">My Shortlist</span>
      <span className="rounded-full bg-fg/[0.06] px-1.5 type-meta tabular-nums">{saved.length}</span>
    </Link>
  );
}

function ViewToggle({ value, onChange }: { value: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  return (
    <div role="radiogroup" aria-label="Layout" className="inline-flex h-10 rounded-full bg-surface p-1 ring-1 ring-line">
      {(["grid", "list"] as const).map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          aria-label={v === "grid" ? "Grid view" : "List view"}
          onClick={() => onChange(v)}
          className={cn("relative grid w-9 place-items-center rounded-full", value === v ? "text-on-contrast" : "text-fg-muted hover:text-fg")}
        >
          {value === v && <motion.span layoutId="view-pill" transition={spring.pill} className="absolute inset-0 rounded-full bg-contrast" />}
          {v === "grid" ? <GridGlyph /> : <ListGlyph />}
        </button>
      ))}
    </div>
  );
}

const GridGlyph = () => (
  <svg aria-hidden viewBox="0 0 16 16" className="relative size-4" fill="currentColor">
    <rect x="2" y="2" width="5" height="5" rx="1.2" />
    <rect x="9" y="2" width="5" height="5" rx="1.2" />
    <rect x="2" y="9" width="5" height="5" rx="1.2" />
    <rect x="9" y="9" width="5" height="5" rx="1.2" />
  </svg>
);
const ListGlyph = () => (
  <svg aria-hidden viewBox="0 0 16 16" className="relative size-4" fill="currentColor">
    <rect x="2" y="2.5" width="12" height="3" rx="1.2" />
    <rect x="2" y="6.5" width="12" height="3" rx="1.2" />
    <rect x="2" y="10.5" width="12" height="3" rx="1.2" />
  </svg>
);

function RegionBar({ explorer }: { explorer: Explorer }) {
  const { state, all, update, toggle } = explorer;
  const counts = regionCounts(all, state);
  const stateCounts = facetCounts(all, state, "state");
  const regionStates = state.region
    ? [...new Map(all.filter((c) => c.region === state.region).map((c) => [c.stateSlug, c.state])).entries()].sort((a, b) =>
        a[1].localeCompare(b[1]),
      )
    : [];

  return (
    <LayoutGroup id="regions">
      <div className="flex items-center gap-1.5 pb-2">
        <MapPicker explorer={explorer} />
        <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {([null, ...Object.keys(REGIONS)] as (Region | null)[]).map((r) => {
          const on = state.region === r;
          const n = r ? (counts.get(r) ?? 0) : null;
          return (
            <button
              key={r ?? "all"}
              type="button"
              aria-pressed={on}
              disabled={r !== null && n === 0 && !on}
              onClick={() =>
                update((s) => ({
                  region: r,
                  // leaving a region drops the states that belonged to it
                  state: r ? s.state.filter((slug) => all.some((c) => c.stateSlug === slug && c.region === r)) : s.state,
                }))
              }
              className={cn(
                "relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 type-caption font-medium transition-colors disabled:opacity-35",
                on ? "text-on-contrast" : "text-fg-muted ring-1 ring-line hover:text-fg",
              )}
            >
              {on && <motion.span layoutId="region-pill" transition={spring.pill} className="absolute inset-0 rounded-full bg-contrast" />}
              <span className="relative">{r ? REGIONS[r] : "All India"}</span>
              {n !== null && <span className={cn("relative type-meta tabular-nums", on ? "text-on-contrast/60" : "text-fg-subtle")}>{n}</span>}
            </button>
          );
        })}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {state.region && regionStates.length > 0 && (
          <motion.div
            key={state.region}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: ease.out }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pl-0.5 [scrollbar-width:none]">
              <Icon name="chevron-right" className="size-3.5 shrink-0 text-fg-subtle" />
              {regionStates.map(([slug, label], i) => {
                const on = state.state.includes(slug);
                const n = stateCounts.get(slug) ?? 0;
                return (
                  <motion.button
                    key={slug}
                    type="button"
                    aria-pressed={on}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => toggle("state", slug)}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 type-caption transition-colors",
                      on ? "bg-accent-soft font-semibold text-accent-text ring-1 ring-accent/40" : "bg-surface text-fg-2 ring-1 ring-line hover:ring-line-strong",
                    )}
                  >
                    {on && <Icon name="check" className="size-3" strokeWidth={2.5} />}
                    {label}
                    <span className="type-meta text-fg-subtle tabular-nums">{n}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

const labelFor = (facet: string, value: string, explorer: Explorer) => {
  switch (facet) {
    case "type":
      return INSTITUTE_TYPES[value as keyof typeof INSTITUTE_TYPES]?.plural ?? value;
    case "state":
      return explorer.all.find((c) => c.stateSlug === value)?.state ?? value;
    case "city":
      return explorer.all.find((c) => c.citySlug === value)?.city ?? value;
    case "branch":
      return BRANCHES[value] ?? value;
    case "course":
      return COURSES[value] ?? value;
    case "category":
      return OWNERSHIP[value] ?? value;
    case "quota":
      return QUOTAS[value] ?? value;
    case "counselling":
      return COUNSELLING[value] ?? value;
    default:
      return value;
  }
};

function ActiveChips({ explorer }: { explorer: Explorer }) {
  const { state, toggle, update, clearFilters } = explorer;
  const facets = ["type", "state", "city", "branch", "course", "category", "quota", "counselling"] as const;
  const chips = facets.flatMap((f) => (state[f] as string[]).map((v) => ({ f, v })));
  const any = chips.length > 0 || state.q || state.region;

  return (
    <AnimatePresence initial={false}>
      {any && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: ease.out }}
          className="overflow-hidden"
        >
          <ul className="flex flex-wrap items-center gap-1.5 pb-3" aria-label="Active filters">
            <AnimatePresence initial={false} mode="popLayout">
              {state.q && (
                <Chip key="q" label={`“${state.q}”`} onRemove={() => update({ q: "" })} />
              )}
              {state.region && (
                <Chip key="region" label={REGIONS[state.region]} onRemove={() => update({ region: null })} />
              )}
              {chips.map(({ f, v }) => (
                <Chip key={`${f}-${v}`} label={labelFor(f, v, explorer)} onRemove={() => toggle(f, v)} />
              ))}
            </AnimatePresence>
            <li>
              <button
                type="button"
                onClick={clearFilters}
                className="h-7 rounded-full px-2.5 type-caption font-semibold text-accent-text hover:bg-accent-soft/60"
              >
                Clear all
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Chip = forwardRef<HTMLLIElement, { label: string; onRemove: () => void }>(function Chip({ label, onRemove }, ref) {
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={spring.toggle}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="group inline-flex h-7 items-center gap-1 rounded-full bg-contrast pr-1.5 pl-3 type-caption font-medium text-on-contrast"
      >
        {label}
        <span className="grid size-4.5 place-items-center rounded-full bg-on-contrast/12 transition-colors group-hover:bg-on-contrast/25">
          <Icon name="close" className="size-3" />
        </span>
      </button>
    </motion.li>
  );
});
