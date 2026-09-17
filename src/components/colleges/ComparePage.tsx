"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Toggle } from "@/components/forms/Toggle";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { colleges } from "@/data/colleges";
import type { College } from "@/lib/colleges/model";
import { COMPARE_MAX, useCompare } from "@/lib/colleges/store";
import { BRANCHES, COUNSELLING, COURSES, INSTITUTE_TYPES, OWNERSHIP, QUOTAS } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { ease } from "@/lib/motion";
import { popularityOf } from "./CollegePreview";
import { feeLabel } from "./feeLabel";
import { Monogram } from "./Monogram";

type Cell = { text: string; muted?: boolean; list?: string[] };
type Row = {
  label: string;
  cell: (c: College) => Cell;
  /** Lower is better: the best college gets a "Best" tag */
  score?: (c: College) => number | null;
};

const soon: Cell = { text: "Data coming soon", muted: true };
const orNot = (v: string | null | undefined): Cell => (v ? { text: v } : { text: "Not listed", muted: true });

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Basics",
    rows: [
      { label: "Location", cell: (c) => ({ text: `${c.city}, ${c.state}` }) },
      { label: "Institute type", cell: (c) => ({ text: INSTITUTE_TYPES[c.type].label }) },
      { label: "Established", cell: (c) => orNot(c.established ? String(c.established) : null) },
      { label: "Category", cell: (c) => orNot(c.ownership ? OWNERSHIP[c.ownership] : null) },
      { label: "Counselling", cell: (c) => ({ text: c.counselling.map((k) => COUNSELLING[k] ?? k).join(" · ") }) },
      { label: "Quotas", cell: (c) => orNot(c.quotas.map((q) => QUOTAS[q] ?? q).join(" · ")) },
    ],
  },
  {
    title: "Academics",
    rows: [
      {
        label: "Branches",
        cell: (c) =>
          c.branches.length
            ? { text: `${c.branches.length} branches`, list: c.branches.map((b) => BRANCHES[b] ?? b) }
            : { text: "Not listed", muted: true },
      },
      { label: "Courses", cell: (c) => orNot(c.courses.map((k) => COURSES[k] ?? k).join(" · ")) },
    ],
  },
  {
    title: "Admission",
    rows: [
      {
        label: "CSE cutoff (2025)",
        cell: (c) =>
          orNot(c.closingRank ? `${formatNumber(c.closingRank)} · JEE ${c.rankExam === "advanced" ? "Advanced" : "Main"}` : null),
        score: (c) => (c.closingRank === null ? null : (c.rankExam === "advanced" ? 0 : 1e7) + c.closingRank),
      },
      {
        label: "Best opening rank",
        cell: (c) => orNot(c.openingRank ? `${formatNumber(c.openingRank)} · JEE ${c.rankExam === "advanced" ? "Advanced" : "Main"}` : null),
        score: (c) => (c.openingRank === null ? null : (c.rankExam === "advanced" ? 0 : 1e7) + c.openingRank),
      },
      { label: "Popularity", cell: (c) => orNot(popularityOf(c)?.label) },
    ],
  },
  {
    title: "Cost & campus",
    rows: [
      { label: "Fees (approx.)", cell: (c) => (c.fees === null ? { text: "Not listed", muted: true } : { text: feeLabel(c.fees) }), score: (c) => c.fees },
      { label: "Seats (approx.)", cell: (c) => orNot(c.seats ? formatNumber(c.seats) : null) },
      { label: "Hostel", cell: (c) => orNot(c.hostel === null ? null : c.hostel ? "Available" : "Not available") },
      { label: "Campus", cell: () => soon },
      { label: "Student life", cell: () => soon },
    ],
  },
  { title: "Outcomes", rows: [{ label: "Placements", cell: () => soon }] },
];

export function ComparePage() {
  const params = useSearchParams();
  const pathname = usePathname();
  const store = useCompare();
  const fromUrl = useMemo(
    () =>
      (params.get("c") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => colleges.some((c) => c.slug === s)),
    [params],
  );
  const slugs = (fromUrl.length ? fromUrl : store.list).slice(0, COMPARE_MAX);
  const picked = slugs.map((s) => colleges.find((c) => c.slug === s)!).filter(Boolean);
  const [highlight, setHighlight] = useState(true);
  const [copied, setCopied] = useState(false);

  // A shared link becomes the compare selection
  const urlKey = fromUrl.join(",");
  useEffect(() => {
    if (urlKey && urlKey !== store.list.join(",")) store.set(urlKey.split(","));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const setSlugs = (next: string[]) => {
    store.set(next);
    const q = next.length ? `?c=${next.join(",")}` : "";
    window.history.replaceState(null, "", `${pathname}${q}`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${pathname}?c=${slugs.join(",")}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="glow-accent absolute top-[-40%] left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full" />
      </div>
      <Container size="wide" className="relative pt-[112px] pb-section md:pt-[140px]">
        <Link href="/colleges" className="inline-flex items-center gap-1.5 type-caption font-medium text-fg-muted hover:text-fg">
          <Icon name="arrow-left" className="size-3.5" />
          Back to colleges
        </Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="type-h1">Compare colleges</h1>
            <p className="mt-3 type-body-lg text-fg-muted">
              Side by side, up to {COMPARE_MAX} at a time. {picked.length > 0 && `${picked.length} selected.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Toggle label="Highlight differences" checked={highlight} onCheckedChange={setHighlight} className="items-center" />
            <button
              type="button"
              onClick={copy}
              disabled={picked.length < 2}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 type-button ring-1 ring-line transition-colors hover:ring-line-strong disabled:opacity-40"
            >
              <Icon name={copied ? "check" : "link"} className="size-4" />
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-panel bg-surface shadow-card">
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">College comparison</caption>
              <thead>
                <tr className="align-top">
                  <th scope="col" className="sticky left-0 z-20 w-36 bg-surface p-4 sm:w-44">
                    <span className="type-label text-fg-subtle">Colleges</span>
                  </th>
                  <AnimatePresence initial={false}>
                    {picked.map((c) => (
                      <motion.th
                        key={c.slug}
                        scope="col"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: ease.out }}
                        className="w-[16rem] p-4 font-normal"
                      >
                        <div className="relative rounded-2xl p-3 ring-1 ring-line">
                          <button
                            type="button"
                            onClick={() => setSlugs(slugs.filter((s) => s !== c.slug))}
                            aria-label={`Remove ${c.short}`}
                            className="absolute top-2 right-2 grid size-7 place-items-center rounded-full text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
                          >
                            <Icon name="close" className="size-3.5" />
                          </button>
                          <Monogram college={c} size="sm" />
                          <p className="mt-2 pr-6 type-body font-semibold leading-tight">{c.short}</p>
                          <p className="mt-0.5 type-caption text-fg-muted">
                            {c.city}, {c.state}
                          </p>
                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 type-caption font-semibold text-accent-text hover:underline"
                            >
                              View college
                              <Icon name="arrow-up-right" className="size-3" />
                            </a>
                          )}
                        </div>
                      </motion.th>
                    ))}
                  </AnimatePresence>
                  {picked.length < COMPARE_MAX && (
                    <th scope="col" className="w-[16rem] p-4 font-normal">
                      <AddCollege exclude={slugs} onAdd={(slug) => setSlugs([...slugs, slug])} />
                    </th>
                  )}
                </tr>
              </thead>
              {picked.length > 0 &&
                GROUPS.map((g) => (
                  <tbody key={g.title}>
                    <tr>
                      <th colSpan={picked.length + 2} scope="colgroup" className="sticky left-0 bg-surface-2/60 px-4 py-2 type-label text-fg-subtle">
                        {g.title}
                      </th>
                    </tr>
                    {g.rows.map((row) => {
                      const cells = picked.map((c) => row.cell(c));
                      const differs = new Set(cells.map((x) => x.text)).size > 1;
                      const scores = row.score ? picked.map((c) => row.score!(c)) : [];
                      const valid = scores.filter((v): v is number => v !== null);
                      const best = valid.length > 1 && new Set(valid).size > 1 ? Math.min(...valid) : null;
                      const on = highlight && differs && picked.length > 1;
                      return (
                        <tr key={row.label} className={cn("border-t border-line align-top transition-colors", on && "bg-accent-soft/35")}>
                          <th scope="row" className={cn("sticky left-0 z-10 p-4 type-body-sm font-semibold", on ? "bg-[color-mix(in_oklab,var(--accent-soft)_35%,var(--surface))]" : "bg-surface")}>
                            {row.label}
                            {on && <span className="mt-0.5 block type-meta font-normal text-accent-text">Differs</span>}
                          </th>
                          {cells.map((cell, i) => (
                            <td key={picked[i].slug} className="p-4 type-body-sm">
                              <span className={cn(cell.muted ? "text-fg-subtle" : "text-fg-2")}>{cell.text}</span>
                              {best !== null && scores[i] === best && (
                                <span className="ml-2 rounded-full bg-success-soft px-1.5 py-0.5 type-meta text-success">Best</span>
                              )}
                              {cell.list && (
                                <ul className="mt-2 flex flex-wrap gap-1">
                                  {cell.list.map((b) => (
                                    <li key={b} className="rounded-md bg-fg/[0.04] px-1.5 py-0.5 type-caption">
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          ))}
                          {picked.length < COMPARE_MAX && <td />}
                        </tr>
                      );
                    })}
                  </tbody>
                ))}
            </table>
          </div>
          {picked.length < 2 && (
            <div className="border-t border-line px-6 py-10 text-center">
              <p className="type-h4">{picked.length === 0 ? "Pick colleges to compare." : "Add one more college."}</p>
              <p className="mt-2 type-body-sm text-fg-muted">
                Use “Add a college” above, or choose Compare on any college in the explorer.
              </p>
              <Link
                href="/colleges"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-contrast px-5 type-button text-on-contrast shadow-button"
              >
                Explore colleges
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
          )}
        </div>
        <p className="mt-4 type-caption text-fg-muted">
          Cutoffs are JoSAA 2025 final round, OPEN, gender-neutral closing ranks for Computer Science. JEE Advanced and JEE Main ranks are different lists and are not comparable with each other.
        </p>
      </Container>
    </div>
  );
}

function AddCollege({ exclude, onAdd }: { exclude: string[]; onAdd: (slug: string) => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const id = useId();
  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return colleges
      .filter((c) => !exclude.includes(c.slug) && (c.short.toLowerCase().includes(t) || c.name.toLowerCase().includes(t) || c.city.toLowerCase().includes(t)))
      .slice(0, 6);
  }, [q, exclude]);

  const add = (slug: string) => {
    onAdd(slug);
    setQ("");
    setActive(0);
  };

  return (
    <div className="relative rounded-2xl border border-dashed border-line-strong p-3">
      <p className="flex items-center gap-1.5 type-body-sm font-semibold">
        <Icon name="plus" className="size-4" />
        Add a college
      </p>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && matches[active]) {
            e.preventDefault();
            add(matches[active].slug);
          } else if (e.key === "Escape") setQ("");
        }}
        role="combobox"
        aria-expanded={matches.length > 0}
        aria-controls={`${id}-list`}
        aria-activedescendant={matches[active] ? `${id}-${matches[active].slug}` : undefined}
        aria-label="Search a college to add"
        placeholder="Search by name or city"
        className="mt-2 h-10 w-full rounded-xl bg-surface-2/70 px-3 type-body-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-accent/60"
      />
      {matches.length > 0 && (
        <ul id={`${id}-list`} role="listbox" className="absolute inset-x-3 top-full z-30 mt-1 rounded-2xl bg-surface p-1 shadow-float ring-1 ring-line">
          {matches.map((c, i) => (
            <li
              key={c.slug}
              id={`${id}-${c.slug}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(c.slug)}
              onPointerMove={() => setActive(i)}
              className={cn("flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5", i === active && "bg-fg/[0.05]")}
            >
              <Monogram college={c} size="sm" />
              <span className="min-w-0">
                <span className="block truncate type-body-sm font-semibold">{c.short}</span>
                <span className="block truncate type-caption text-fg-muted">{c.city}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
