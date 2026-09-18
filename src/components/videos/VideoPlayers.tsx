"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { formatPublished, type Video } from "@/lib/youtube";

const embed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

/** Nothing loads from YouTube until someone actually presses play. */
function Frame({ video, className }: { video: Video; className?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn("group/frame relative overflow-hidden rounded-card bg-[#0b0b10] shadow-card", className)}>
      <AnimatePresence initial={false}>
        {playing ? (
          <motion.iframe
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={embed(video.id)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <motion.button
            key="poster"
            type="button"
            onClick={() => setPlaying(true)}
            exit={{ opacity: 0 }}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 size-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumb}
              alt=""
              loading="lazy"
              className="size-full scale-[1.02] object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/frame:scale-105"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_6_10/0.86),rgb(6_6_10/0.15)_52%,transparent)]" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-white/92 text-[#0b0b10] shadow-float transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover/frame:scale-110">
                <Icon name="arrow-right" className="size-6" />
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The two most recent long videos, side by side on a wide screen. */
export function FeaturedVideos({ videos }: { videos: Video[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {videos.map((v, i) => (
        <motion.li
          key={v.id}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 0.6, ease: ease.out, delay: i * 0.08 }}
          className="min-w-0"
        >
          <Frame video={v} className="aspect-video w-full" />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="type-h4 line-clamp-2">{v.title}</h3>
              <p className="mt-1 type-caption text-fg-muted">{formatPublished(v.published)}</p>
            </div>
            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-surface px-4 type-caption font-semibold shadow-hairline hover:bg-surface-2"
            >
              YouTube
              <Icon name="arrow-up-right" className="size-3.5" />
            </a>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

/** Shorts, in a strip you can swipe through on a phone. */
export function ShortsRail({ videos }: { videos: Video[] }) {
  return (
    <ul className="-mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-3 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
      {videos.map((v, i) => (
        <motion.li
          key={v.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, ease: ease.out, delay: i * 0.06 }}
          className="w-[62vw] shrink-0 snap-start sm:w-[42vw] md:w-auto"
        >
          <Frame video={v} className="aspect-[9/16] w-full" />
          <p className="mt-3 line-clamp-2 type-body-sm font-medium">{v.title}</p>
          <p className="mt-0.5 type-caption text-fg-muted">{formatPublished(v.published)}</p>
        </motion.li>
      ))}
    </ul>
  );
}
