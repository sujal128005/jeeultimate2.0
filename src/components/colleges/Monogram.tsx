"use client";

import { useState } from "react";
import type { College } from "@/lib/colleges/model";
import { INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";

/**
 * Identity badge. The college's own site icon is shown when it loads,
 * with the periodic-table style monogram underneath as the fallback.
 */
export function Monogram({ college, size = "md" }: { college: College; size?: "md" | "sm" }) {
  const [logoOk, setLogoOk] = useState(false);
  const t = INSTITUTE_TYPES[college.type];
  const { top, symbol } = college.monogram;
  const box = size === "md" ? "size-14" : "size-11";

  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
        box,
        size === "md" ? "px-2 pt-2 pb-1.5" : "px-1.5 pt-1.5 pb-1",
      )}
      style={{ background: `linear-gradient(145deg, ${t.color}, color-mix(in oklab, ${t.color} 55%, #0e0e10))` }}
    >
      <span className="truncate font-mono text-[8.5px] leading-none tracking-wide opacity-80">{top || t.label}</span>
      <span
        className={cn(
          "self-end leading-none font-semibold tracking-[-0.04em]",
          size === "md" ? (symbol.length > 3 ? "text-[15px]" : "text-[22px]") : symbol.length > 3 ? "text-[12px]" : "text-[17px]",
        )}
      >
        {symbol}
      </span>
      {college.logo && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={college.logo}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={(e) => setLogoOk(e.currentTarget.naturalWidth > 24)}
          onError={() => setLogoOk(false)}
          className={cn(
            "absolute inset-0 size-full bg-white object-contain p-1.5 transition-opacity duration-300",
            logoOk ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}
