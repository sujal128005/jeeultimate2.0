"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * The third door out of the hero, kept to an icon so it never competes with
 * the two buttons beside it. The word arrives on hover, and on a keyboard it
 * is always there for a screen reader.
 */
export function VideosButton() {
  const [hot, setHot] = useState(false);

  return (
    <Link
      href="/videos"
      aria-label="Videos"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      className="glass glass-interactive group/videos inline-flex h-15 items-center gap-0 overflow-hidden rounded-full px-[18px] text-fg-2 transition-[padding,color] duration-(--duration-base) ease-(--ease-out-soft) hover:text-fg focus-visible:text-fg"
    >
      <Icon name="video" className="size-[22px] shrink-0" />
      <span
        aria-hidden
        className={
          "grid overflow-hidden text-left type-button whitespace-nowrap transition-[grid-template-columns,opacity,margin] duration-(--duration-base) ease-(--ease-out-soft) " +
          (hot ? "ml-2.5 grid-cols-[1fr] opacity-100" : "ml-0 grid-cols-[0fr] opacity-0")
        }
      >
        <span className="min-w-0">Videos</span>
      </span>
    </Link>
  );
}
