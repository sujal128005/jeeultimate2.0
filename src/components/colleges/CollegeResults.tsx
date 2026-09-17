"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { SortKey } from "@/lib/colleges/engine";
import type { College } from "@/lib/colleges/model";
import { BRANCHES, COUNSELLING, INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { ease } from "@/lib/motion";

const PAGE = 24;

export const feeLabel = (fees: number | null) =>
  fees === null ? "Not listed" : fees >= 100000 ? `₹${(fees / 100000).toFixed(2).replace(/\.?0+$/, "")}L / yr` : `₹${formatNumber(fees)} / yr`;

type Props = {
  results: College[];
  view: "grid" | "list";
  sort: SortKey;
  resetKey: string;
};

export function CollegeResults({ results, view, sort, resetKey }: Props) {
  const [limit, setLimit] = useState({ key: resetKey, n: PAGE });
  if (limit.key !== resetKey) setLimit({ key: resetKey, n: PAGE });
  const shown = results.slice(0, limit.key === resetKey ? limit.n : PAGE);
  const reduce = useReducedMotion();

  return (
    <div>
      <LayoutGroup>
        {view === "grid" ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((c, i) => (
                <motion.li
                  key={c.slug}
                  layout={!reduce}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.4, ease: ease.out, delay: Math.min(i, 12) * 0.02 }}
                >
                  <CollegeCard college={c} sort={sort} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="overflow-hidden rounded-panel bg-surface shadow-hairline">
            <div className="hidden grid-cols-[minmax(0,2.4fr)_0.8fr_0.7fr_1fr_1fr_1.2fr] gap-4 border-b border-line px-5 py-3 type-label text-fg-subtle lg:grid">
              <span>College</span>
              <span>Type</span>
              <span>Est.</span>
              <span>Fees</span>
              <span>CSE cutoff</span>
              <span>Counselling</span>
            </div>
            <ul className="divide-y divide-line">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((c, i) => (
                  <motion.li
                    key={c.slug}
                    layout={!reduce ? "position" : false}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.35, ease: ease.out, delay: Math.min(i, 12) * 0.015 }}
                  >
                    <CollegeRow college={c} sort={sort} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </LayoutGroup>

      {results.length > shown.length && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setLimit({ key: resetKey, n: limit.n + PAGE })}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-surface px-6 type-button shadow-hairline transition-colors hover:bg-surface-2"
          >
            Show more
            <Icon name="arrow-down" className="size-4" />
          </button>
          <p className="type-caption text-fg-muted">
            Showing {shown.length} of {results.length}
          </p>
        </div>
      )}
    </div>
  );
}

function Monogram({ college, size = "md" }: { college: College; size?: "md" | "sm" }) {
  const t = INSTITUTE_TYPES[college.type];
  const { top, symbol } = college.monogram;
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
        size === "md" ? "size-14 px-2 pt-2 pb-1.5" : "size-11 px-1.5 pt-1.5 pb-1",
      )}
      style={{ background: `linear-gradient(145deg, ${t.color}, color-mix(in oklab, ${t.color} 55%, #0e0e10))` }}
    >
      <span className="truncate font-mono text-[8.5px] leading-none tracking-wide opacity-80">{top || t.label}</span>
      <span
        className={cn(
          "self-end leading-none font-semibold tracking-[-0.04em]",
          size === "md" ? (symbol.length > 3 ? "text-[15px]" : "text-[22px]") : symbol.length > 3 ? "text-[12px]" : "text-[17px]",
        )}
      >
        {symbol}
      </span>
    </span>
  );
}

function Stat({ label, value, sub, on }: { label: string; value: string; sub?: string; on?: boolean }) {
  return (
    <div className={cn("min-w-0 rounded-xl px-2.5 py-2 transition-colors", on ? "bg-accent-soft" : "bg-surface-2/70")}>
      <p className={cn("truncate type-meta", on ? "text-accent-text" : "text-fg-subtle")}>{label}</p>
      <p className="mt-0.5 truncate type-body-sm font-semibold tabular-nums">
        {value}
        {sub && <span className="ml-1 type-meta font-normal text-fg-muted">{sub}</span>}
      </p>
    </div>
  );
}

const rankSub = (c: College) => (c.closingRank === null ? undefined : c.rankExam === "advanced" ? "Adv" : "Main");

export function CollegeCard({ college: c, sort }: { college: College; sort: SortKey }) {
  const t = INSTITUTE_TYPES[c.type];
  return (
    <article
      style={{ "--t": t.color } as React.CSSProperties}
      className="group relative flex h-full flex-col rounded-card bg-surface p-4 shadow-hairline transition-[box-shadow,transform] duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-0.5 hover:shadow-card"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-card bg-[radial-gradient(120%_100%_at_0%_0%,color-mix(in_oklab,var(--t)_10%,transparent),transparent_70%)] opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100"
      />
      <div className="relative flex items-start gap-3">
        <Monogram college={c} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[1.05rem] leading-tight font-semibold tracking-[-0.02em]">{c.short}</h3>
          <p className="mt-0.5 line-clamp-2 type-caption text-fg-muted">{c.name}</p>
        </div>
      </div>

      <p className="relative mt-3 flex items-center gap-1.5 type-body-sm text-fg-2">
        <Icon name="map-pin" className="size-3.5 shrink-0 text-fg-subtle" />
        <span className="truncate">
          {c.city}, {c.state}
        </span>
      </p>
      <p className="relative mt-1 type-caption text-fg-muted">
        <span className="font-semibold" style={{ color: t.color }}>
          {t.label}
        </span>
        {c.established && <> · Est. {c.established}</>}
        {c.branches.length > 0 && <> · {c.branches.length} branches</>}
      </p>

      <div className="relative mt-auto grid grid-cols-2 gap-1.5 pt-4">
        <Stat label="Fees" value={feeLabel(c.fees)} on={sort === "fees"} />
        <Stat
          label={c.rankYear ? `CSE cutoff ${c.rankYear}` : "CSE cutoff"}
          value={c.closingRank ? formatNumber(c.closingRank) : "Not listed"}
          sub={rankSub(c)}
          on={sort === "cutoff" || sort === "popularity"}
        />
      </div>
      <div className="relative mt-3 flex flex-wrap gap-1">
        {c.counselling.map((k) => (
          <span key={k} className="rounded-full px-2 py-0.5 type-meta text-fg-muted ring-1 ring-line">
            {COUNSELLING[k] ?? k}
          </span>
        ))}
        {c.branches.includes("cse") && (
          <span className="rounded-full px-2 py-0.5 type-meta text-fg-muted ring-1 ring-line">{BRANCHES.cse}</span>
        )}
      </div>
    </article>
  );
}

function CollegeRow({ college: c, sort }: { college: College; sort: SortKey }) {
  const t = INSTITUTE_TYPES[c.type];
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-fg/[0.02] lg:grid-cols-[minmax(0,2.4fr)_0.8fr_0.7fr_1fr_1fr_1.2fr] lg:gap-4 lg:px-5">
      <div className="col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1">
        <Monogram college={c} size="sm" />
        <div className="min-w-0">
          <p className="truncate type-body font-semibold">{c.short}</p>
          <p className="truncate type-caption text-fg-muted">
            {c.city}, {c.state}
          </p>
        </div>
      </div>
      <div className="col-span-2 flex flex-wrap gap-x-4 gap-y-1 pl-14 type-caption text-fg-muted lg:contents">
        <span className="font-semibold lg:type-body-sm" style={{ color: t.color }}>
          {t.label}
        </span>
        <span className="lg:type-body-sm lg:text-fg-2">{c.established ? <><span className="lg:hidden">Est. </span>{c.established}</> : "Not listed"}</span>
        <span className={cn("lg:type-body-sm lg:text-fg-2", sort === "fees" && "font-semibold text-accent-text lg:text-accent-text")}>
          <span className="lg:hidden">Fees </span>
          {feeLabel(c.fees)}
        </span>
        <span className={cn("tabular-nums lg:type-body-sm lg:text-fg-2", (sort === "cutoff" || sort === "popularity") && "font-semibold text-accent-text lg:text-accent-text")}>
          <span className="lg:hidden">CSE cutoff </span>
          {c.closingRank ? formatNumber(c.closingRank) : "Not listed"}
          {rankSub(c) && <span className="ml-1 type-meta font-normal text-fg-subtle">{rankSub(c)}</span>}
        </span>
        <span className="truncate lg:type-body-sm lg:text-fg-2">{c.counselling.map((k) => COUNSELLING[k] ?? k).join(" · ")}</span>
      </div>
    </div>
  );
}
