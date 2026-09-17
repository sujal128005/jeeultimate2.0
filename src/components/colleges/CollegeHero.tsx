"use client";

import { motion } from "motion/react";
import { forwardRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { facetCounts } from "@/lib/colleges/engine";
import { ease } from "@/lib/motion";
import { CategoryPills } from "./CategoryPills";
import { CollegeSearch } from "./CollegeSearch";
import { scrollToExplorer, type Explorer } from "./useExplorer";
import { applySuggestion } from "./applySuggestion";

/** Section 1: short hero with the main search and category pills. */
export const CollegeHero = forwardRef<HTMLInputElement, { explorer: Explorer }>(function CollegeHero({ explorer }, ref) {
  const { state, update, all } = explorer;
  const typeCounts = facetCounts(all, { ...state, q: "" }, "type");

  return (
    <section aria-labelledby="colleges-title" className="relative isolate overflow-x-clip pt-[112px] pb-10 has-[[aria-expanded=true]]:z-40 md:pt-[148px] md:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="glow-accent absolute top-[-30%] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full" />
      </div>
      <div className="mx-auto flex max-w-[52rem] flex-col items-center px-gutter text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out }}>
          <Eyebrow>Colleges</Eyebrow>
        </motion.div>
        <motion.h1
          id="colleges-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.05 }}
          className="mt-5 text-[clamp(2.3rem,6vw,4.4rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance"
        >
          Find the right college. <span className="text-fg/40">Not just a college.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.12 }}
          className="mt-5 max-w-[38rem] type-body-lg text-fg-muted"
        >
          Explore IITs, NITs, IIITs, GFTIs and the colleges in JAC Delhi and UPTAC, all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}
          className="mt-8 w-full"
        >
          <CollegeSearch
            ref={ref}
            value={state.q}
            onChange={(q) => update({ q })}
            onSubmit={(q) => {
              update({ q });
              scrollToExplorer();
            }}
            onPick={(s) => {
              applySuggestion(update, s);
              scrollToExplorer();
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-5 flex w-full justify-center"
        >
          <CategoryPills
            layoutId="hero-type-pill"
            value={state.type}
            counts={typeCounts}
            onChange={(t) => update({ type: t ? [t] : [] })}
          />
        </motion.div>
      </div>
    </section>
  );
});
