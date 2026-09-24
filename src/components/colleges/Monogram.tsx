"use client";

import { useState } from "react";
import { collegeLogos } from "@/data/colleges/logos";
import type { College } from "@/lib/colleges/model";
import { INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";

/**
 * Identity badge for a college.
 *
 * The badge is drawn here rather than fetched, so every college has one: no
 * third-party favicon service, nothing to load, nothing to fail, and no record
 * of which colleges a student is looking at leaving the page. Each institute
 * type has its own colour family, and the exact shade is derived from the
 * college's own slug so two IITs never look identical.
 *
 * A real crest is used when one exists: drop a square PNG at
 * public/colleges/<slug>.png and run `npm run logos` to register it.
 */

/** Colour family per institute type, in OKLCH so shades stay evenly bright. */
const FAMILY: Record<string, { l: number; c: number; h: number }> = {
  iit: { l: 0.52, c: 0.18, h: 274 },
  nit: { l: 0.55, c: 0.12, h: 187 },
  iiit: { l: 0.53, c: 0.19, h: 300 },
  gfti: { l: 0.58, c: 0.15, h: 62 },
  other: { l: 0.5, c: 0.06, h: 252 },
};

/** Stable small integer from a slug, so a college always gets the same shade. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function shades(college: College) {
  const base = FAMILY[college.type] ?? FAMILY.other;
  const n = hash(college.slug);
  // Spread within the family: up to 26 degrees of hue and a little lightness.
  const hue = base.h + ((n % 27) - 13);
  const lift = ((n >> 5) % 7) / 100;
  const top = `oklch(${(base.l + lift + 0.08).toFixed(3)} ${base.c} ${hue})`;
  const bottom = `oklch(${(base.l + lift - 0.16).toFixed(3)} ${(base.c * 0.82).toFixed(3)} ${hue + 8})`;
  return { top, bottom };
}

export function Monogram({ college, size = "md" }: { college: College; size?: "md" | "sm" }) {
  const crest = college.logo ?? (collegeLogos.has(college.slug) ? `/colleges/${college.slug}.png` : null);
  const [crestOk, setCrestOk] = useState(false);
  const t = INSTITUTE_TYPES[college.type];
  const { top, symbol } = college.monogram;
  const { top: c1, bottom: c2 } = shades(college);
  const md = size === "md";

  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl text-white",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.28),inset_0_0_0_1px_rgb(0_0_0/0.12)]",
        md ? "size-14 px-2 pt-2 pb-1.5" : "size-11 px-1.5 pt-1.5 pb-1",
      )}
      style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}
    >
      {/* A soft corner light, so the tile reads as an object rather than a swatch */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -right-1/4 size-full rounded-full bg-white/18 blur-[10px]"
      />

      <span className="relative truncate font-mono text-[8.5px] leading-none tracking-wide opacity-85">
        {top || t.label}
      </span>
      <span
        className={cn(
          "relative self-end leading-none font-semibold tracking-[-0.04em] drop-shadow-[0_1px_1px_rgb(0_0_0/0.25)]",
          md
            ? symbol.length > 3
              ? "text-[15px]"
              : "text-[22px]"
            : symbol.length > 3
              ? "text-[12px]"
              : "text-[17px]",
        )}
      >
        {symbol}
      </span>

      {crest && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={crest}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={(e) => setCrestOk(e.currentTarget.naturalWidth > 16)}
          onError={() => setCrestOk(false)}
          className={cn(
            "absolute inset-0 size-full bg-white object-contain p-1.5 transition-opacity duration-300",
            crestOk ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}
