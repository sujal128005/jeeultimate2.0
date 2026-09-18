"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { CHANNEL_URL, formatPublished, type Video } from "@/lib/youtube";

const embed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
const SUB_KEY = "ju:youtube:subscribed";

/**
 * Everything on the videos page that can play, in one client component, so a
 * single piece of state decides which video is running. Starting one stops
 * whatever was playing before: only one player exists at a time.
 */
export function VideoStage({ long, shorts }: { long: Video[]; shorts: Video[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {long.length > 0 && (
        <section id="latest" aria-labelledby="latest-title" className="scroll-mt-28">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="type-label text-fg-muted">Latest videos</p>
              <h2 id="latest-title" className="mt-2 type-h3">
                The long ones
              </h2>
            </div>
            <SubscribeButton />
          </header>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2">
            {long.map((v, i) => (
              <motion.li
                key={v.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out, delay: i * 0.07 }}
                className="min-w-0"
              >
                <Player video={v} active={active === v.id} onPlay={setActive} className="aspect-video" />
                <Caption video={v} index={i + 1} kind="Long video" />
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      {shorts.length > 0 && (
        <section id="shorts" aria-labelledby="shorts-title" className="scroll-mt-28">
          <header className="mb-6">
            <p className="type-label text-fg-muted">Shorts</p>
            <h2 id="shorts-title" className="mt-2 type-h3">
              One answer, one minute
            </h2>
          </header>
          <ul className="-mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
            {shorts.map((v, i) => (
              <motion.li
                key={v.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: ease.out, delay: 0.1 + i * 0.05 }}
                className="w-[58vw] shrink-0 snap-start sm:w-[38vw] md:w-auto"
              >
                <Player video={v} active={active === v.id} onPlay={setActive} className="aspect-[9/16]" short />
                <p className="mt-3 line-clamp-2 type-body-sm leading-snug font-medium">{v.title}</p>
                <p className="mt-1 type-meta text-fg-muted">{formatPublished(v.published)}</p>
              </motion.li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Player({
  video,
  active,
  onPlay,
  className,
  short,
}: {
  video: Video;
  active: boolean;
  onPlay: (id: string | null) => void;
  className?: string;
  short?: boolean;
}) {
  return (
    <div className={cn("group/frame relative overflow-hidden rounded-card bg-[#0b0b10] shadow-card", className)}>
      <AnimatePresence initial={false}>
        {active ? (
          <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
            <iframe
              src={embed(video.id)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full"
            />
            <button
              type="button"
              onClick={() => onPlay(null)}
              aria-label="Close player"
              className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/75 focus-visible:opacity-100 group-hover/frame:opacity-100"
            >
              <Icon name="close" className="size-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="poster"
            type="button"
            onClick={() => onPlay(video.id)}
            exit={{ opacity: 0 }}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 size-full text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumb}
              alt=""
              loading="lazy"
              className={cn(
                "size-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/frame:scale-[1.04]",
                short && "scale-[1.35] group-hover/frame:scale-[1.42]",
              )}
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_6_10/0.72),rgb(6_6_10/0.08)_46%,transparent)]" />
            <span className="absolute inset-0 grid place-items-center">
              <span
                className={cn(
                  "grid place-items-center rounded-full bg-white/94 text-[#0b0b10] shadow-float transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover/frame:scale-110",
                  short ? "size-12" : "size-16",
                )}
              >
                <PlayGlyph className={short ? "size-4" : "size-5"} />
              </span>
            </span>
            {short && (
              <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2 py-1 type-meta text-white">Short</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M8 5.2v13.6c0 .9 1 1.5 1.8 1L20.4 13a1.2 1.2 0 0 0 0-2L9.8 4.2C9 3.7 8 4.3 8 5.2Z" fill="currentColor" />
    </svg>
  );
}

function Caption({ video, index, kind }: { video: Video; index: number; kind: string }) {
  return (
    <div className="mt-4 flex items-start gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 font-mono text-[11px] text-fg-muted">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 type-body leading-snug font-semibold">{video.title}</h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-2 type-meta text-fg-muted">
          <span>{kind}</span>
          <span aria-hidden className="size-[3px] rounded-full bg-fg-subtle" />
          <span>{formatPublished(video.published)}</span>
          <span aria-hidden className="size-[3px] rounded-full bg-fg-subtle" />
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-accent-text hover:underline"
          >
            Open on YouTube
            <Icon name="arrow-up-right" className="size-3" />
          </a>
        </p>
      </div>
    </div>
  );
}

const SUB_EVENT = "ju:youtube:subscribed-change";

function readSubscribed() {
  try {
    return window.localStorage.getItem(SUB_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeToFlag(cb: () => void) {
  window.addEventListener(SUB_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(SUB_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/**
 * Subscribing happens on YouTube, so this opens YouTube and then asks you
 * whether it worked. We never claim you subscribed on your behalf: you tell
 * us, and the answer stays in your browser.
 */
export function SubscribeButton({ className }: { className?: string }) {
  const subscribed = useSyncExternalStore(subscribeToFlag, readSubscribed, () => false);
  const [asking, setAsking] = useState(false);

  const confirm = () => {
    try {
      window.localStorage.setItem(SUB_KEY, "1");
    } catch {
      /* storage unavailable: nothing to persist, the event still repaints */
    }
    setAsking(false);
    window.dispatchEvent(new Event(SUB_EVENT));
  };

  if (subscribed) {
    return (
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.toggle}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full bg-surface-2 px-5 type-button text-fg-2 shadow-hairline",
          className,
        )}
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -16, 13, -9, 6, 0] }}
          transition={{ duration: 0.85, ease: "easeInOut", delay: 0.1 }}
          className="grid size-5 origin-top place-items-center"
        >
          <Icon name="check-circle" className="size-5 text-accent-text" />
        </motion.span>
        Subscribed
      </motion.span>
    );
  }

  return (
    <span className={cn("relative inline-flex", className)}>
      <a
        href={`${CHANNEL_URL}?sub_confirmation=1`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setAsking(true)}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ff0033] px-5 type-button text-white transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
      >
        Subscribe
        <Icon name="arrow-up-right" className="size-4" />
      </a>
      <AnimatePresence>
        {asking && (
          <motion.button
            type="button"
            onClick={confirm}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-[calc(100%+0.5rem)] right-0 z-10 inline-flex h-10 items-center gap-2 rounded-full bg-contrast px-4 type-caption font-semibold whitespace-nowrap text-on-contrast shadow-float"
          >
            <Icon name="check" className="size-3.5" />
            Done? Mark as subscribed
          </motion.button>
        )}
      </AnimatePresence>
    </span>
  );
}
