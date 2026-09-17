"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { colleges } from "@/data/colleges";
import { useCompare, useShortlist } from "@/lib/colleges/store";
import { ease } from "@/lib/motion";
import { CollegeCard } from "./CollegeCard";
import { CompareButton } from "./CollegePreview";
import { CollegeUIProvider, useCollegeUI } from "./CollegeUI";
import { CompareTray } from "./CompareTray";

/** My Shortlist: saved colleges, with remove and compare. */
export function ShortlistPage() {
  return (
    <CollegeUIProvider>
      <ShortlistBody />
      <CompareTray />
    </CollegeUIProvider>
  );
}

function ShortlistBody() {
  const { saved, remove, clear } = useShortlist();
  const compare = useCompare();
  const { notify, openPreview } = useCollegeUI();
  const list = saved.map((s) => colleges.find((c) => c.slug === s)).filter((c) => c !== undefined);

  const compareAll = () => {
    compare.set(list.map((c) => c.slug));
    if (list.length > 4) notify("Added the first 4 colleges to compare.");
  };

  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[480px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-40%] left-1/2 h-[460px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_77_109/0.14),transparent)]" />
      </div>
      <Container size="wide" className="relative pt-[112px] pb-section md:pt-[140px]">
        <Link href="/colleges" className="inline-flex items-center gap-1.5 type-caption font-medium text-fg-muted hover:text-fg">
          <Icon name="arrow-left" className="size-3.5" />
          Back to colleges
        </Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 type-h1">
              My Shortlist
              <Icon name="heart" className="size-[0.7em] fill-[#ff4d6d] text-[#ff4d6d]" />
            </h1>
            <p className="mt-3 type-body-lg text-fg-muted">
              {list.length ? `${list.length} saved ${list.length === 1 ? "college" : "colleges"}. Saved on this device.` : "Colleges you save appear here."}
            </p>
          </div>
          {list.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 type-button text-fg-muted ring-1 ring-line hover:text-fg"
              >
                <Icon name="reset" className="size-4" />
                Clear all
              </button>
              <button
                type="button"
                onClick={compareAll}
                disabled={list.length < 2}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-contrast px-5 type-button text-on-contrast shadow-button disabled:opacity-40"
              >
                <Icon name="scale" className="size-4" />
                Compare {Math.min(list.length, 4)}
              </button>
            </div>
          )}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-panel border border-dashed border-line-strong px-6 py-16 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-[#ff4d6d]/10 text-[#e11d48]">
              <Icon name="heart" className="size-7" />
            </span>
            <h2 className="mt-5 type-h4">Nothing saved yet.</h2>
            <p className="mt-2 max-w-[26rem] type-body-sm text-fg-muted">
              Hover over a college (or tap it on your phone) and choose Save to build your shortlist.
            </p>
            <Link href="/colleges" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-contrast px-5 type-button text-on-contrast shadow-button">
              Explore colleges
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((c, i) => (
                <motion.li
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: ease.out, delay: Math.min(i, 8) * 0.03 }}
                  className="flex flex-col"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`${c.short}, open quick view`}
                    onClick={() => openPreview(c.slug)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openPreview(c.slug))}
                    className="flex-1 cursor-pointer rounded-card"
                  >
                    <CollegeCard college={c} sort="popularity" />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => remove(c.slug)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full type-button text-fg-muted ring-1 ring-line hover:text-fg"
                    >
                      <Icon name="close" className="size-4" />
                      Remove
                    </button>
                    <CompareButton slug={c.slug} />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </Container>
    </div>
  );
}
