"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { SortKey } from "@/lib/colleges/engine";
import type { College } from "@/lib/colleges/model";
import { COUNSELLING, INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { feeLabel } from "./feeLabel";
import { Monogram } from "./Monogram";
import { CollegeHoverCard, RowActions } from "./CollegeHoverCard";
import { useCollegeUI } from "./CollegeUI";
import { ease } from "@/lib/motion";

const PAGE = 24;

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
                  <CollegeHoverCard college={c} sort={sort} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="overflow-hidden rounded-panel bg-surface shadow-hairline">
            <div className="hidden grid-cols-[minmax(0,2.4fr)_0.8fr_0.7fr_1fr_1fr_1.2fr_5rem] gap-4 border-b border-line px-5 py-3 type-label text-fg-subtle lg:grid">
              <span>College</span>
              <span>Type</span>
              <span>Est.</span>
              <span>Fees</span>
              <span>CSE cutoff</span>
              <span>Counselling</span>
              <span className="sr-only">Actions</span>
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

const rankSub = (c: College) => (c.closingRank === null ? undefined : c.rankExam === "advanced" ? "Adv" : "Main");

function CollegeRow({ college: c, sort }: { college: College; sort: SortKey }) {
  const t = INSTITUTE_TYPES[c.type];
  const { openPreview } = useCollegeUI();
  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`${c.short}, open quick view`}
      onClick={() => openPreview(c.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPreview(c.slug);
        }
      }}
      className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-fg/[0.025] lg:grid-cols-[minmax(0,2.4fr)_0.8fr_0.7fr_1fr_1fr_1.2fr_auto] lg:gap-4 lg:px-5"
    >
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
      <div className="col-start-3 row-start-1 lg:col-start-auto lg:row-start-auto">
        <RowActions slug={c.slug} />
      </div>
    </div>
  );
}
