"use client";

import { Icon } from "@/components/ui/Icon";
import type { SortKey } from "@/lib/colleges/engine";
import type { College } from "@/lib/colleges/model";
import { useCompare, useShortlist } from "@/lib/colleges/store";
import { BRANCHES, COUNSELLING, INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { feeLabel } from "./feeLabel";
import { Monogram } from "./Monogram";

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
      <CardMarks slug={c.slug} />
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


/** Small corner marks when a college is saved or being compared. */
function CardMarks({ slug }: { slug: string }) {
  const { has: saved } = useShortlist();
  const { has: comparing } = useCompare();
  if (!saved(slug) && !comparing(slug)) return null;
  return (
    <span className="absolute right-3 bottom-3 z-10 flex gap-1" aria-hidden>
      {saved(slug) && (
        <span className="grid size-6 place-items-center rounded-full bg-[#ff4d6d]/12 text-[#e11d48]">
          <Icon name="heart" className="size-3 fill-current" />
        </span>
      )}
      {comparing(slug) && (
        <span className="grid size-6 place-items-center rounded-full bg-contrast text-on-contrast">
          <Icon name="scale" className="size-3" />
        </span>
      )}
    </span>
  );
}
