"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { INDIA_ISLANDS, INDIA_MAINLAND, MAP_STATES, MAP_VIEW } from "@/data/india-map";
import { facetCounts } from "@/lib/colleges/engine";
import { regionOf, slugify, type Region } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { REGION_COLORS } from "./mapColors";
import type { Explorer } from "./useExplorer";

/** The real map of India, with one bubble per state. */
export function IndiaOutline({ explorer }: { explorer: Explorer }) {
  const { state, all, update } = explorer;
  const [hover, setHover] = useState<string | null>(null);
  const counts = facetCounts(all, { ...state, region: null, state: [] }, "state");

  const toggleState = (slug: string, region: Region | null) =>
    update((s) => ({
      state: s.state.includes(slug) ? s.state.filter((v) => v !== slug) : [...s.state, slug],
      region: s.region && s.region !== region ? null : s.region,
    }));

  const hovered = MAP_STATES.find((s) => s.code === hover);

  return (
    <div>
      <p className="h-5 truncate type-caption text-fg-muted" aria-live="polite">
        {hovered
          ? `${hovered.name} · ${counts.get(slugify(hovered.name)) ?? 0} colleges`
          : state.state.length
            ? `${state.state.length} state${state.state.length > 1 ? "s" : ""} selected`
            : "Tap a state to filter"}
      </p>

      <svg
        viewBox={`${MAP_VIEW.x} ${MAP_VIEW.y} ${MAP_VIEW.w} ${MAP_VIEW.h}`}
        role="group"
        aria-label="Map of India"
        className="mt-1 w-full overflow-visible"
      >
        <motion.path
          d={INDIA_MAINLAND}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5, ease: ease.out },
          }}
          className="fill-fg/[0.05] stroke-line-strong"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {INDIA_ISLANDS.map((d, i) => (
          <path key={i} d={d} className="fill-fg/[0.05] stroke-line-strong" strokeWidth={2} />
        ))}

        {MAP_STATES.map((s, i) => {
          const slug = slugify(s.name);
          const region = regionOf(s.name);
          const n = counts.get(slug) ?? 0;
          const on = state.state.includes(slug);
          const dim = (state.region !== null && region !== state.region) || (n === 0 && !on);
          const color = region ? REGION_COLORS[region] : "#64748b";
          const moved = Math.hypot(s.x - s.ax, s.y - s.ay) > 8;
          return (
            <g
              key={s.code}
              style={{ "--c": color } as React.CSSProperties}
              className={cn("transition-opacity duration-200", dim && "opacity-30")}
            >
              {moved && <line x1={s.ax} y1={s.ay} x2={s.x} y2={s.y} stroke="var(--c)" strokeWidth={2} opacity={0.4} />}
              <motion.g
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.1 + i * 0.012,
                  duration: 0.32,
                  ease: ease.out,
                }}
                style={{ originX: `${s.x}px`, originY: `${s.y}px` }}
              >
                <circle cx={s.x} cy={s.y} r={on ? 34 : 29} fill="white" opacity={0.9} />
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={on ? 32 : 27}
                  fill={on ? "var(--c)" : `color-mix(in oklab, var(--c) 22%, white)`}
                  stroke="var(--c)"
                  strokeWidth={on ? 0 : 2.5}
                />
                <text
                  x={s.x}
                  y={s.y + 7}
                  textAnchor="middle"
                  className="pointer-events-none font-mono text-[19px] font-semibold"
                  fill={on ? "white" : "color-mix(in oklab, var(--c) 78%, black)"}
                >
                  {s.code}
                </text>
                {n > 0 && (
                  <>
                    <circle cx={s.x + 22} cy={s.y - 22} r={13} fill="var(--color-contrast)" />
                    <text
                      x={s.x + 22}
                      y={s.y - 17}
                      textAnchor="middle"
                      className="pointer-events-none font-mono text-[15px] font-semibold"
                      fill="var(--color-on-contrast)"
                    >
                      {n}
                    </text>
                  </>
                )}
              </motion.g>
              <circle
                cx={s.x}
                cy={s.y}
                r={34}
                fill="transparent"
                role="button"
                tabIndex={n === 0 && !on ? -1 : 0}
                aria-pressed={on}
                aria-label={`${s.name}, ${n} colleges`}
                className={cn("outline-none", n > 0 || on ? "cursor-pointer" : "cursor-not-allowed")}
                onMouseEnter={() => setHover(s.code)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(s.code)}
                onBlur={() => setHover(null)}
                onClick={() => (n > 0 || on) && toggleState(slug, region)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && (n > 0 || on)) {
                    e.preventDefault();
                    toggleState(slug, region);
                  }
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
