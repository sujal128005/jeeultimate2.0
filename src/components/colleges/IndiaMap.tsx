"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { facetCounts } from "@/lib/colleges/engine";
import { REGIONS, regionOf, slugify, type Region } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { IndiaOutline } from "./IndiaOutline";
import { REGION_COLORS } from "./mapColors";
import type { Explorer } from "./useExplorer";

/** Schematic tile map of India: one tile per state/UT, placed roughly by geography. */
const TILES: {
  code: string;
  name: string;
  x: number;
  y: number;
  w?: number;
}[] = [
  { code: "JK", name: "Jammu and Kashmir", x: 3, y: 0 },
  { code: "LA", name: "Ladakh", x: 4, y: 0 },
  { code: "PB", name: "Punjab", x: 1, y: 1 },
  { code: "CH", name: "Chandigarh", x: 2, y: 1 },
  { code: "HP", name: "Himachal Pradesh", x: 3, y: 1 },
  { code: "UK", name: "Uttarakhand", x: 4, y: 1 },
  { code: "SK", name: "Sikkim", x: 7, y: 1 },
  { code: "AR", name: "Arunachal Pradesh", x: 9, y: 1 },
  { code: "RJ", name: "Rajasthan", x: 1, y: 2 },
  { code: "HR", name: "Haryana", x: 2, y: 2 },
  { code: "DL", name: "Delhi", x: 3, y: 2 },
  { code: "UP", name: "Uttar Pradesh", x: 4, y: 2 },
  { code: "BR", name: "Bihar", x: 5, y: 2 },
  { code: "AS", name: "Assam", x: 8, y: 2 },
  { code: "NL", name: "Nagaland", x: 9, y: 2 },
  { code: "GJ", name: "Gujarat", x: 0, y: 3 },
  { code: "MP", name: "Madhya Pradesh", x: 2, y: 3, w: 2 },
  { code: "CG", name: "Chhattisgarh", x: 4, y: 3 },
  { code: "JH", name: "Jharkhand", x: 5, y: 3 },
  { code: "WB", name: "West Bengal", x: 6, y: 3 },
  { code: "ML", name: "Meghalaya", x: 7, y: 3 },
  { code: "MN", name: "Manipur", x: 9, y: 3 },
  { code: "DD", name: "Dadra and Nagar Haveli and Daman and Diu", x: 0, y: 4 },
  { code: "MH", name: "Maharashtra", x: 1, y: 4, w: 2 },
  { code: "TS", name: "Telangana", x: 3, y: 4 },
  { code: "OD", name: "Odisha", x: 5, y: 4 },
  { code: "TR", name: "Tripura", x: 8, y: 4 },
  { code: "MZ", name: "Mizoram", x: 9, y: 4 },
  { code: "GA", name: "Goa", x: 0, y: 5 },
  { code: "KA", name: "Karnataka", x: 1, y: 5 },
  { code: "AP", name: "Andhra Pradesh", x: 2, y: 5, w: 2 },
  { code: "KL", name: "Kerala", x: 1, y: 6 },
  { code: "TN", name: "Tamil Nadu", x: 2, y: 6 },
  { code: "PY", name: "Puducherry", x: 3, y: 6 },
  { code: "AN", name: "Andaman and Nicobar Islands", x: 6, y: 6 },
  { code: "LD", name: "Lakshadweep", x: 0, y: 7 },
];

const COLS = 10;
const ROWS = 8;

/** "Map" button in the region bar with a pop-over tile map. */
export function MapPicker({ explorer }: { explorer: Explorer }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"map" | "grid">("map");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-3 type-caption font-semibold ring-1 transition-colors",
          open ? "bg-accent-soft text-accent-text ring-accent/40" : "bg-surface text-fg-2 ring-line hover:ring-line-strong",
        )}
      >
        <Icon name="map-pin" className="size-3.5" />
        Map
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Pick a state on the map"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.26, ease: ease.out },
            }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.14 } }}
            className="absolute top-full left-0 z-(--z-dropdown) mt-2 max-h-[calc(100dvh-11rem)] w-[min(92vw,29rem)] origin-top-left overflow-y-auto overscroll-contain rounded-3xl bg-surface p-4 shadow-float ring-1 ring-line"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="type-body-sm font-semibold">Pick states</p>
              <div className="flex rounded-full bg-fg/[0.05] p-0.5">
                {(["map", "grid"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className={cn(
                      "h-7 rounded-full px-3 type-caption font-semibold capitalize transition-colors",
                      view === v ? "bg-surface text-fg shadow-hairline" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">{view === "map" ? <IndiaOutline explorer={explorer} /> : <IndiaMap explorer={explorer} />}</div>
            <RegionLegend explorer={explorer} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function IndiaMap({ explorer }: { explorer: Explorer }) {
  const { state, all, update } = explorer;
  const [hover, setHover] = useState<string | null>(null);
  const counts = facetCounts(all, { ...state, region: null, state: [] }, "state");
  const hovered = TILES.find((t) => t.code === hover);

  const toggleState = (slug: string, region: Region | null) =>
    update((s) => ({
      state: s.state.includes(slug) ? s.state.filter((v) => v !== slug) : [...s.state, slug],
      region: s.region && s.region !== region ? null : s.region,
    }));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="h-5 truncate type-caption text-fg-muted" aria-live="polite">
          {hovered
            ? `${hovered.name} · ${counts.get(slugify(hovered.name)) ?? 0} colleges`
            : `${state.state.length || "No"} selected`}
        </p>
      </div>

      <div
        className="mt-1 grid aspect-[10/8] gap-1"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
      >
        {TILES.map((t, i) => {
          const slug = slugify(t.name);
          const region = regionOf(t.name);
          const n = counts.get(slug) ?? 0;
          const on = state.state.includes(slug);
          const dimRegion = state.region !== null && region !== state.region;
          const color = region ? REGION_COLORS[region] : "#64748b";
          return (
            <motion.button
              key={t.code}
              type="button"
              aria-pressed={on}
              aria-label={`${t.name}, ${n} colleges`}
              disabled={n === 0 && !on}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.012, duration: 0.3, ease: ease.out }}
              whileHover={{ scale: 1.12, zIndex: 10 }}
              whileTap={{ scale: 0.94 }}
              onMouseEnter={() => setHover(t.code)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(t.code)}
              onBlur={() => setHover(null)}
              onClick={() => toggleState(slug, region)}
              style={
                {
                  gridColumn: `${t.x + 1} / span ${t.w ?? 1}`,
                  gridRow: t.y + 1,
                  "--c": color,
                } as React.CSSProperties
              }
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center rounded-[9px] font-mono text-[10px] leading-none font-semibold transition-[transform,background-color,color,opacity] duration-200 disabled:cursor-not-allowed",
                on
                  ? "bg-[var(--c)] text-white shadow-[0_6px_14px_-6px_var(--c)]"
                  : n > 0
                    ? "bg-[color-mix(in_oklab,var(--c)_16%,transparent)] text-[color-mix(in_oklab,var(--c)_80%,black)]"
                    : "bg-fg/[0.04] text-fg-subtle",
                dimRegion && !on && "opacity-35",
              )}
            >
              {t.code}
              {n > 0 && <span className={cn("mt-0.5 text-[8px] font-normal", on ? "text-white/80" : "opacity-70")}>{n}</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** Region shortcuts and a clear button, shared by both views. */
function RegionLegend({ explorer }: { explorer: Explorer }) {
  const { state, update } = explorer;
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
      {(Object.keys(REGIONS) as Region[]).map((r) => (
        <li key={r}>
          <button
            type="button"
            aria-pressed={state.region === r}
            onClick={() => update((s) => ({ region: s.region === r ? null : r }))}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 type-caption transition-colors",
              state.region === r ? "bg-contrast text-on-contrast" : "ring-1 ring-line hover:ring-line-strong",
            )}
          >
            <span className="size-2 rounded-full" style={{ background: REGION_COLORS[r] }} />
            {REGIONS[r]}
          </button>
        </li>
      ))}
      {state.state.length > 0 && (
        <li className="ml-auto">
          <button
            type="button"
            onClick={() => update({ state: [] })}
            className="h-7 rounded-full px-2.5 type-caption font-semibold text-accent-text hover:bg-accent-soft/60"
          >
            Clear states
          </button>
        </li>
      )}
    </ul>
  );
}
