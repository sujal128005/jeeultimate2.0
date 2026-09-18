"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { colleges } from "@/data/colleges";
import { popularBranches, popularityIndex, type College } from "@/lib/colleges/model";
import { useCompare, useShortlist } from "@/lib/colleges/store";
import { BRANCHES, COUNSELLING, INSTITUTE_TYPES, OWNERSHIP } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { spring } from "@/lib/motion";
import { feeLabel } from "./feeLabel";
import { Monogram } from "./Monogram";
import { useCollegeUI } from "./CollegeUI";

export const popularityOf = popularityIndex(colleges);

function Fact({ icon, label, value, muted }: { icon: IconName; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-surface-2/70 px-2.5 py-2">
      <Icon name={icon} className="size-4 shrink-0 text-fg-subtle" />
      <div className="min-w-0">
        <p className="truncate type-meta text-fg-subtle">{label}</p>
        <p className={cn("truncate type-body-sm font-semibold tabular-nums", muted && "font-normal text-fg-muted")}>{value}</p>
      </div>
    </div>
  );
}

export function PopularityBadge({ college }: { college: College }) {
  const p = popularityOf(college);
  if (!p) return null;
  return (
    <span title={p.note} className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 type-meta text-accent-text">
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-[3px] rounded-full", i <= p.level ? "bg-accent-strong" : "bg-accent-strong/25")} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {p.label}
    </span>
  );
}

export function SaveButton({ slug, size = "md" }: { slug: string; size?: "md" | "sm" }) {
  const { has, toggle } = useShortlist();
  const on = has(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "group/save inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors active:scale-95",
        size === "md" ? "h-10 px-4 type-button" : "size-9",
        on ? "bg-[#ff4d6d]/12 text-[#e11d48] ring-1 ring-[#ff4d6d]/30" : "bg-surface ring-1 ring-line hover:ring-line-strong",
      )}
      aria-label={size === "sm" ? (on ? "Remove from shortlist" : "Save to shortlist") : undefined}
    >
      <motion.span key={String(on)} initial={{ scale: on ? 0.4 : 1 }} animate={{ scale: 1 }} transition={spring.toggle}>
        <Icon name="heart" className={cn("size-4", on && "fill-current")} />
      </motion.span>
      {size === "md" && (on ? "Saved" : "Save")}
    </button>
  );
}

export function CompareButton({ slug, size = "md" }: { slug: string; size?: "md" | "sm" }) {
  const { has } = useCompare();
  const { toggleCompare } = useCollegeUI();
  const on = has(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation();
        toggleCompare(slug);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-colors active:scale-95",
        size === "md" ? "h-10 px-4 type-button" : "size-9",
        on ? "bg-contrast text-on-contrast" : "bg-surface ring-1 ring-line hover:ring-line-strong",
      )}
      aria-label={size === "sm" ? (on ? "Remove from compare" : "Add to compare") : undefined}
    >
      <Icon name={on ? "check" : "scale"} className="size-4" />
      {size === "md" && (on ? "Comparing" : "Compare")}
    </button>
  );
}

/** Decision-useful summary of a college. Used in the hover panel and the tap sheet. */
export function CollegePreviewBody({ college: c, variant }: { college: College; variant: "hover" | "sheet" }) {
  const t = INSTITUTE_TYPES[c.type];
  const branches = popularBranches(c);
  return (
    <div className={cn(variant === "hover" && "p-4")}>
      <div className="flex items-start gap-3">
        <Monogram college={c} />
        <div className="min-w-0 flex-1">
          {variant === "hover" && <p className="type-h4 leading-tight">{c.short}</p>}
          <p className="line-clamp-2 type-caption text-fg-muted">{c.name}</p>
          <p className="mt-1 flex items-center gap-1 type-body-sm text-fg-2">
            <Icon name="map-pin" className="size-3.5 text-fg-subtle" />
            {c.city}, {c.state}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full px-2 py-0.5 type-meta text-white" style={{ background: t.color }}>
          {t.label}
        </span>
        {c.established && <span className="rounded-full px-2 py-0.5 type-meta text-fg-muted ring-1 ring-line">Est. {c.established}</span>}
        {c.ownership && <span className="rounded-full px-2 py-0.5 type-meta text-fg-muted ring-1 ring-line">{OWNERSHIP[c.ownership]}</span>}
        {c.nirfRank !== null && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 type-meta font-semibold text-accent-text">
            NIRF #{c.nirfRank}
            {c.nirfYear ? ` · ${c.nirfYear}` : ""}
          </span>
        )}
        <PopularityBadge college={c} />
      </div>

      {branches.length > 0 && (
        <div className="mt-4">
          <p className="type-label text-fg-subtle">Popular branches</p>
          <ul className="mt-1.5 flex flex-wrap gap-1">
            {branches.map((b) => (
              <li key={b} className="rounded-lg bg-accent-soft/60 px-2 py-1 type-caption font-medium">
                {BRANCHES[b]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-1.5">
        <Fact icon="layers" label="Programs" value={c.branches.length ? `${c.branches.length} branches` : "Not listed"} muted={!c.branches.length} />
        <Fact icon="users" label="Seats (approx.)" value={c.seats ? formatNumber(c.seats) : "Not listed"} muted={!c.seats} />
        <Fact icon="ticket" label="Fees (approx.)" value={feeLabel(c.fees)} muted={c.fees === null} />
        <Fact
          icon="building"
          label="Hostel"
          value={c.hostel === null ? "Not listed" : c.hostel ? "Available" : "Not available"}
          muted={c.hostel === null}
        />
        <Fact
          icon="chart"
          label={`CSE cutoff ${c.rankYear ?? ""}`.trim()}
          value={c.closingRank ? `${formatNumber(c.closingRank)} ${c.rankExam === "advanced" ? "(Adv)" : "(Main)"}` : "Not listed"}
          muted={!c.closingRank}
        />
        <Fact icon="compass" label="Counselling" value={c.counselling.map((k) => COUNSELLING[k] ?? k).join(" · ")} />
        {c.placement?.median != null && (
          <Fact icon="chart" label={`Median package ${c.placement.year ?? ""}`.trim()} value={`${c.placement.median} LPA`} />
        )}
        {c.placement?.placedPct != null && <Fact icon="users" label="Students placed" value={`${c.placement.placedPct}%`} />}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SaveButton slug={c.slug} />
        <CompareButton slug={c.slug} />
        {c.website ? (
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group/v ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-contrast pr-1.5 pl-4 type-button text-on-contrast shadow-button max-sm:ml-0 max-sm:w-full max-sm:justify-between"
          >
            View college
            <span className="grid size-7 place-items-center rounded-full bg-on-contrast/12 transition-transform group-hover/v:translate-x-0.5 group-hover/v:-translate-y-0.5">
              <Icon name="arrow-up-right" className="size-3.5" />
            </span>
            <span className="sr-only">(official website, opens in a new tab)</span>
          </a>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 type-caption">
        <Link href={`/previous-cutoffs?college=${c.slug}`} className="inline-flex items-center gap-1 font-medium text-fg-2 hover:text-fg">
          <Icon name="chart" className="size-3.5" />
          Previous cutoffs
        </Link>
        <Link href={`/ai-predictor?college=${c.slug}`} className="inline-flex items-center gap-1 font-medium text-fg-2 hover:text-fg">
          <Icon name="sparkles" className="size-3.5" />
          Check my chances
          <span className="rounded-full bg-fg/[0.06] px-1.5 type-meta text-fg-subtle">Soon</span>
        </Link>
      </div>
    </div>
  );
}
