"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { counsellingTerms } from "@/data/counselling-hub";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";

type Term = (typeof counsellingTerms)[number];

/** Glossary: pick a term, see what it means with a small visual. */
export function TermsExplorer() {
  const [active, setActive] = useState(0);
  const term = counsellingTerms[active];

  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:col-span-6 lg:grid-cols-2" role="tablist" aria-label="Counselling terms">
        {counsellingTerms.map((t, i) => {
          const on = i === active;
          return (
            <li key={t.term} role="presentation" className="contents">
              <button
                type="button"
                role="tab"
                id={`term-${i}`}
                aria-selected={on}
                aria-controls="term-panel"
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex min-h-[6.5rem] flex-col justify-between overflow-hidden rounded-card p-4 text-left transition-[transform,box-shadow] duration-(--duration-base) ease-(--ease-out-soft) active:scale-[0.98]",
                  on ? "text-on-contrast shadow-lift" : "bg-surface shadow-hairline hover:-translate-y-0.5 hover:shadow-card",
                )}
              >
                {on && (
                  <motion.span layoutId="term-active" transition={spring.panel} className="absolute inset-0 rounded-card bg-contrast" />
                )}
                <span className={cn("relative type-meta tabular-nums", on ? "text-accent-on-contrast" : "text-fg-subtle")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">
                  <span className="block text-[1.2rem] font-semibold tracking-[-0.03em]">{t.term}</span>
                  <span className={cn("mt-0.5 block type-caption", on ? "text-on-contrast/60" : "text-fg-muted")}>{t.short}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        id="term-panel"
        role="tabpanel"
        aria-labelledby={`term-${active}`}
        className="relative min-h-[24rem] overflow-hidden rounded-panel bg-surface p-6 shadow-card sm:p-8 lg:sticky lg:top-28 lg:col-span-6"
      >
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full glow-accent" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={term.term}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="relative"
          >
            <p className="type-label text-accent-text">Counselling term</p>
            <h3 className="mt-3 text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-semibold tracking-[-0.05em]">{term.term}</h3>
            <p className="mt-4 type-body-lg text-fg-2">{term.body}</p>
            <div className="mt-6">
              <TermVisual term={term} />
            </div>
            <div className="mt-6 rounded-2xl bg-accent-soft/60 p-4">
              <p className="type-label text-accent-text">Example</p>
              <p className="mt-1.5 type-body-sm text-fg">{term.example}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const sampleList = [
  { inst: "NIT A", branch: "CSE" },
  { inst: "NIT B", branch: "CSE" },
  { inst: "NIT A", branch: "ECE" },
  { inst: "NIT B", branch: "ECE" },
];
const CURRENT = 3;

function TermVisual({ term }: { term: Term }) {
  const name = term.term;
  if (["Freeze", "Float", "Slide", "Upgrade"].includes(name)) {
    const allowed = (i: number) =>
      i < CURRENT &&
      (name === "Float" || name === "Upgrade" || (name === "Slide" && sampleList[i].inst === sampleList[CURRENT].inst));
    return (
      <div className="rounded-2xl p-3 ring-1 ring-line">
        <p className="px-1 pb-2 type-caption text-fg-muted">
          {name === "Freeze" ? "Your list · you stop here" : name === "Upgrade" ? "Your list · moved up in a later round" : "Your list · where you can still move"}
        </p>
        <ol className="grid gap-1.5">
          {sampleList.map((c, i) => {
            const isCurrent = name === "Upgrade" ? i === 1 : i === CURRENT;
            const wasHere = name === "Upgrade" && i === CURRENT;
            const ok = name !== "Upgrade" && allowed(i);
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: ease.out }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 type-body-sm",
                  isCurrent ? "bg-contrast text-on-contrast" : ok ? "bg-success-soft text-fg" : "bg-fg/[0.03] text-fg-muted",
                  wasHere && "line-through decoration-fg-subtle",
                )}
              >
                <span className="type-meta tabular-nums opacity-60">{i + 1}</span>
                <span className="flex-1 font-medium">
                  {c.inst} · {c.branch}
                </span>
                <span className="type-meta">
                  {isCurrent ? (name === "Upgrade" ? "New seat" : "Your seat") : ok ? "Can move here" : wasHere ? "Released" : "Locked out"}
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (name === "Home State" || name === "Other State") {
    const home = name === "Home State";
    return (
      <div className="rounded-2xl p-4 ring-1 ring-line">
        <p className="type-caption text-fg-muted">Seats at every NIT</p>
        <div className="mt-3 flex h-12 overflow-hidden rounded-xl type-body-sm font-semibold">
          <motion.div
            initial={{ flexGrow: 0.5 }}
            animate={{ flexGrow: home ? 1.15 : 0.85 }}
            transition={spring.panel}
            className={cn("flex basis-0 items-center justify-center", home ? "bg-accent-gradient text-on-accent" : "bg-fg/[0.06] text-fg-muted")}
          >
            Home State 50%
          </motion.div>
          <motion.div
            initial={{ flexGrow: 0.5 }}
            animate={{ flexGrow: home ? 0.85 : 1.15 }}
            transition={spring.panel}
            className={cn("flex basis-0 items-center justify-center", !home ? "bg-contrast text-on-contrast" : "bg-fg/[0.06] text-fg-muted")}
          >
            Other State 50%
          </motion.div>
        </div>
        <p className="mt-3 type-caption text-fg-muted">NIT Goa and NIT Srinagar split their Home State seats with nearby UTs.</p>
      </div>
    );
  }

  const pills =
    name === "Quota"
      ? ["Home State (HS)", "Other State (OS)", "All India (AI)", "Delhi region 85%", "Outside Delhi 15%", "UP domicile"]
      : ["OPEN", "GEN-EWS", "OBC-NCL", "SC", "ST", "PwD in each", "Female-only seats"];
  return (
    <ul className="flex flex-wrap gap-2">
      {pills.map((p, i) => (
        <motion.li
          key={p}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 + i * 0.04, ...spring.toggle }}
          className="rounded-full bg-surface px-3.5 py-1.5 type-body-sm font-medium shadow-hairline"
        >
          {p}
        </motion.li>
      ))}
    </ul>
  );
}
