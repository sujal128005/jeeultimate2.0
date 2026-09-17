"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { choiceFilling } from "@/data/counselling-hub";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { ease, spring } from "@/lib/motion";

type Order = "careful" | "careless";
const STEP_MS = 850;

/**
 * Shows how the allotment system reads a choice list: top to bottom,
 * stopping at the first choice the rank can get.
 */
export function ChoiceFillingDemo() {
  const { demo } = choiceFilling;
  const [order, setOrder] = useState<Order>("careful");
  const [run, setRun] = useState({ id: 0, tick: -1 });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  const list = demo[order];
  const allotted = list.findIndex((c) => c.close >= demo.rank);
  const tick = reduce ? allotted : run.tick;
  const finished = tick >= allotted;

  useEffect(() => {
    if (!inView || reduce || run.tick >= allotted) return;
    const id = window.setTimeout(
      () => setRun((r) => (r.id === run.id ? { ...r, tick: r.tick + 1 } : r)),
      run.tick < 0 ? 450 : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, reduce, run, allotted]);

  const replay = (next: Order = order) => {
    setOrder(next);
    setRun((r) => ({ id: r.id + 1, tick: -1 }));
  };

  const best = demo.careful[demo.careful.findIndex((c) => c.close >= demo.rank)];

  return (
    <div ref={ref} className="relative overflow-hidden rounded-panel bg-contrast p-5 text-on-contrast shadow-float sm:p-7">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-20 size-80 rounded-full bg-accent/25 blur-[90px]" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="type-label text-on-contrast/55">How your list is read</p>
          <p className="mt-2 type-h4">
            Rank <span className="text-accent-on-contrast tabular-nums">{formatNumber(demo.rank)}</span>
          </p>
        </div>
        <div role="radiogroup" aria-label="List order" className="flex rounded-full bg-on-contrast/[0.07] p-1 ring-1 ring-on-contrast/10">
          {(["careful", "careless"] as const).map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={order === o}
              onClick={() => replay(o)}
              className={cn(
                "relative h-9 rounded-full px-4 type-nav transition-colors",
                order === o ? "text-on-accent" : "text-on-contrast/60 hover:text-on-contrast",
              )}
            >
              {order === o && (
                <motion.span layoutId="order-pill" transition={spring.pill} className="absolute inset-0 rounded-full bg-accent-gradient" />
              )}
              <span className="relative">{o === "careful" ? "Careful order" : "Careless order"}</span>
            </button>
          ))}
        </div>
      </div>

      <ol className="relative mt-6 grid gap-2">
        {list.map((choice, i) => {
          const checked = tick >= i;
          const isSeat = i === allotted && tick >= i;
          const out = checked && i < allotted;
          const skipped = finished && i > allotted;
          const scanning = !finished && tick + 1 === i && tick >= 0;
          return (
            <motion.li
              key={choice.name}
              layout
              transition={spring.panel}
              className={cn(
                "relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-3 ring-1 transition-[background-color,opacity,box-shadow] duration-300",
                isSeat
                  ? "bg-success/20 ring-success/60"
                  : scanning
                    ? "bg-on-contrast/[0.09] ring-on-contrast/30"
                    : "bg-on-contrast/[0.04] ring-on-contrast/10",
                skipped && "opacity-40",
              )}
            >
              {scanning && (
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-on-contrast/15 to-transparent"
                  initial={{ left: "-35%" }}
                  animate={{ left: "110%" }}
                  transition={{ duration: STEP_MS / 1000, ease: "easeInOut" }}
                />
              )}
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-on-contrast/10 type-meta tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate type-body-sm font-semibold", out && "text-on-contrast/50 line-through decoration-danger/80")}>
                  {choice.name}
                </span>
                <span className="block type-caption text-on-contrast/50 tabular-nums">Closed at {formatNumber(choice.close)}</span>
              </span>
              <AnimatePresence mode="popLayout">
                {isSeat ? (
                  <motion.span
                    key="seat"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={spring.toggle}
                    className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 type-meta text-white"
                  >
                    <Icon name="check" className="size-3" strokeWidth={3} />
                    Seat
                  </motion.span>
                ) : out ? (
                  <motion.span key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="type-meta text-danger">
                    Out of reach
                  </motion.span>
                ) : skipped ? (
                  <motion.span key="skip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="type-meta text-on-contrast/50">
                    Never checked
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ol>

      <div className="relative mt-5 min-h-[4.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {finished && (
            <motion.p
              key={order}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: ease.out }}
              className="type-body-sm text-on-contrast/80"
            >
              {order === "careful" ? (
                <>
                  <strong className="text-on-contrast">Result: {best.name}.</strong> The best seat this rank could get, because
                  the list was in true order of preference.
                </>
              ) : (
                <>
                  <strong className="text-on-contrast">Result: {list[allotted].name}.</strong> {best.name} was within reach, but it
                  sat below Civil on the list, so it was never checked.
                </>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-on-contrast/10 pt-4">
        <p className="type-caption text-on-contrast/45">{demo.note}</p>
        <button
          type="button"
          onClick={() => replay()}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 type-caption font-semibold text-on-contrast ring-1 ring-on-contrast/15 transition-colors hover:bg-on-contrast/[0.08]"
        >
          <Icon name="reset" className="size-3.5" />
          Replay
        </button>
      </div>
    </div>
  );
}
