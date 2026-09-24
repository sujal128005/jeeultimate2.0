"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JourneyLinks } from "@/components/journey/JourneyLinks";
import { collegesPending } from "@/data/colleges";
import { paramsFromState } from "@/lib/colleges/engine";
import { CollegeHero } from "./CollegeHero";
import { CollegeUIProvider } from "./CollegeUI";
import { CompareTray } from "./CompareTray";
import { CollegeResults } from "./CollegeResults";
import { ExplorerToolbar } from "./ExplorerToolbar";
import { FilterPanel } from "./FilterPanel";
import { useExplorer } from "./useExplorer";

/** Sections 1 and 2 of /colleges: hero search and the explorer. */
export function CollegeExplorerApp() {
  const explorer = useExplorer();
  const { state, results, all, update, clearFilters } = explorer;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const heroInput = useRef<HTMLInputElement>(null);
  const barInput = useRef<HTMLInputElement>(null);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);

  // "/" jumps to search: the hero box if it is on screen, otherwise the toolbar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable=true]")) return;
      e.preventDefault();
      const hero = heroInput.current;
      const rect = hero?.getBoundingClientRect();
      const heroVisible = rect && rect.bottom > 80 && rect.top < window.innerHeight;
      (heroVisible ? hero : barInput.current)?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // "Show more" resets whenever the search or filters change (not on sort or view)
  const resetKey = paramsFromState({ ...state, sort: "popularity", view: "grid" });

  return (
    <CollegeUIProvider>
      <CollegeHero ref={heroInput} explorer={explorer} />

      <Container size="wide" className="pb-section">
        <section id="explore" aria-labelledby="explore-title" className="scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="explore-title" className="type-h2">
              Explore Colleges
            </h2>
            {collegesPending.length > 0 && (
              <p className="flex items-center gap-2 rounded-full bg-info-soft px-3 py-1.5 type-caption text-info">
                <Icon name="info" className="size-3.5" />
                {collegesPending.join(", ")} are being added. Showing {all.length} colleges for now.
              </p>
            )}
          </div>

          <ExplorerToolbar ref={barInput} explorer={explorer} onOpenFilters={() => setFiltersOpen(true)} />

          <div className="mt-4">
            <AnimatePresence mode="wait" initial={false}>
              {results.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid place-items-center rounded-panel border border-dashed border-line-strong px-6 py-16 text-center"
                >
                  <span className="relative grid size-16 place-items-center rounded-full bg-accent-soft text-accent-text">
                    <Icon name="search" className="size-7" />
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full ring-2 ring-accent/40"
                      animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  </span>
                  <h3 className="mt-5 type-h4">No colleges match these filters.</h3>
                  <p className="mt-2 max-w-[26rem] type-body-sm text-fg-muted">
                    Try removing a filter, choosing a different region, or searching for something broader.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-contrast px-5 type-button text-on-contrast shadow-button"
                  >
                    <Icon name="reset" className="size-4" />
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CollegeResults results={results} view={state.view} sort={state.sort} resetKey={resetKey} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        <p className="mt-14 flex max-w-[46rem] items-start gap-2.5 type-body-sm text-fg-muted">
          <Icon name="info" className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
          <span>
            Fees, seats and founding years come from each institute&rsquo;s own published documents, and cutoffs from
            past JoSAA rounds. Where a field reads &ldquo;Not listed&rdquo;, the institute has not published a figure we
            could confirm, so we leave it blank rather than guess. Fees change every session, so treat them as the
            order of the cost and check the institute&rsquo;s fee page before you pay.
          </span>
        </p>
        <JourneyLinks
          current="colleges"
          title="Found a few you like?"
          query={state.counselling.length === 1 ? `counselling=${state.counselling[0]}` : undefined}
          className="mt-16 mb-8 md:mt-20"
        />
      </Container>

      <FilterPanel open={filtersOpen} onClose={closeFilters} all={all} state={state} onApply={(patch) => update(patch)} />
      <CompareTray />
    </CollegeUIProvider>
  );
}
