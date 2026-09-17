"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { careerHero, careerStatus } from "@/data/career";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { FieldScene } from "./CareerWorld";
import { MagneticButton } from "./MagneticButton";

const wordStyles = {
  solid: "text-fg",
  hollow: "text-hollow",
  metal:
    "bg-[linear-gradient(180deg,#ffffff_0%,#dfe3f3_38%,#8d95b8_78%,#5c6488_100%)] bg-clip-text text-transparent",
};

export function CareerHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const px = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });

  // Depth layers drift against the pointer
  const backX = useTransform(px, (v) => v * -14);
  const backY = useTransform(py, (v) => v * -10);
  const midX = useTransform(px, (v) => v * -7);
  const midY = useTransform(py, (v) => v * -5);
  const frontX = useTransform(px, (v) => v * 4);
  const frontY = useTransform(py, (v) => v * 3);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      px.set(nx);
      py.set(ny);
      if (readout.current) {
        const fmt = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}`;
        readout.current.textContent = `X ${fmt(nx)}  Y ${fmt(-ny)}`;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  const heading = careerHero.lines.map((line) => line.map((w) => [w.text, w.suffix].filter(Boolean).join(" ")).join(" ")).join(" ");

  return (
    <FieldScene
      id="top"
      as="header"
      request={{
        formation: "sphere",
        stage: { x: 1.05, y: 0.05, scale: 1.08, dim: 1 },
        stageMobile: { x: 0, y: 0.9, scale: 0.72, dim: 0.9 },
      }}
      className="relative"
    >
      <div ref={sectionRef} className="relative flex min-h-svh flex-col px-gutter pt-28 pb-10 md:pt-32">
        <motion.div style={{ y: lift, opacity: fade }} className="relative mx-auto flex w-full max-w-page flex-1 flex-col">
          {/* Status + HUD */}
          <div className="flex items-start justify-between gap-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: ease.out, delay: 0.5 }}
              className="glass-subtle inline-flex items-center gap-3 rounded-full py-2 pr-4 pl-3"
            >
              <span aria-hidden className="relative grid size-3 place-items-center">
                <span className="absolute size-3 animate-ping rounded-full bg-[var(--cw-spark)] opacity-40 motion-reduce:hidden" />
                <span className="size-2 rounded-full bg-[var(--cw-spark)] shadow-[0_0_12px_var(--cw-spark)]" />
              </span>
              <span className="type-pixel text-fg">{careerStatus.primary}</span>
              <span aria-hidden className="h-3 w-px bg-line-strong max-sm:hidden" />
              <span className="type-pixel text-fg-muted max-sm:hidden">{careerStatus.network}</span>
            </motion.p>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              aria-hidden
              className="hidden flex-col items-end gap-1.5 text-right type-pixel text-fg-subtle lg:flex"
            >
              <div className="flex gap-3">
                <dt>Est.</dt>
                <dd className="text-fg-muted">2023</dd>
              </div>
              <div className="flex gap-3">
                <dt>Signal</dt>
                <dd className="text-fg-muted">
                  <span ref={readout}>X +0.00  Y +0.00</span>
                </dd>
              </div>
            </motion.dl>
          </div>

          {/* Dimensional headline */}
          <h1 className="relative mt-auto pt-16 [text-wrap:wrap] lg:pt-10" aria-label={heading}>
            {/* Depth layers - hidden by CSS under reduced motion (no hydration mismatch) */}
            <motion.span aria-hidden style={{ x: backX, y: backY }} className="pointer-events-none absolute inset-x-0 bottom-0 select-none opacity-[0.08] max-sm:hidden motion-reduce:hidden">
              <HeadlineLines variant="ghost" />
            </motion.span>
            <motion.span aria-hidden style={{ x: midX, y: midY }} className="pointer-events-none absolute inset-x-0 bottom-0 select-none opacity-[0.16] max-sm:hidden motion-reduce:hidden">
              <HeadlineLines variant="ghost" />
            </motion.span>
            <motion.span aria-hidden style={{ x: frontX, y: frontY }} className="relative block">
              <HeadlineLines variant="front" />
            </motion.span>
          </h1>

          {/* Lead + CTA */}
          <div className="mt-10 grid items-end gap-8 md:mt-14 lg:grid-cols-12">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 1.1 }}
              className="max-w-[34rem] type-body-lg text-fg-2 lg:col-span-6"
            >
              {careerHero.lead}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 1.25 }}
              className="flex flex-wrap items-center gap-5 lg:col-span-6 lg:justify-end"
            >
              <MagneticButton href="#join">Join the talent network</MagneticButton>
              <a href="#story" className="group/scroll flex items-center gap-3 type-pixel text-fg-muted transition-colors hover:text-fg">
                <span aria-hidden className="relative h-10 w-px overflow-hidden bg-line-strong">
                  <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-in-out-soft)_infinite] bg-fg" />
                </span>
                Scroll to explore
              </a>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.6 }}
            className="mt-10 max-w-xs type-caption text-fg-subtle lg:absolute lg:top-[46%] lg:right-0 lg:mt-0 lg:text-right"
          >
            {careerHero.caption}
          </motion.p>
        </motion.div>
      </div>
    </FieldScene>
  );
}

/** Start delay for each word, so characters cascade across the whole headline. */
const wordDelays = careerHero.lines.map((line, li) =>
  line.map((_, wi) => {
    const before = careerHero.lines
      .flat()
      .slice(0, careerHero.lines.slice(0, li).reduce((n, l) => n + l.length, 0) + wi)
      .reduce((n, w) => n + w.text.length + 1, 0);
    return 0.3 + before * 0.022;
  }),
);

/** Word rises out of a mask with a soft blur - a camera-like focus pull. */
function RevealWord({ text, delay, className }: { text: string; delay: number; className: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className={cn("inline-block pr-[0.03em]", className)}
        initial={{ y: "92%", opacity: 0, filter: "blur(14px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.25, ease: ease.expo, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/** The "2.0" version mark: a raised, glowing badge beside the wordmark. */
function VersionMark({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.span
      className="relative ml-[0.08em] inline-block align-top text-[0.34em] leading-none tracking-[-0.04em]"
      initial={{ opacity: 0, scale: 0.4, rotate: -12, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
    >
      <span className="bg-[linear-gradient(135deg,#ffd166_0%,#ffb020_40%,#ff6d1a_100%)] bg-clip-text text-transparent [filter:drop-shadow(0_0_24px_rgb(255_149_0/0.45))]">
        {text}
      </span>
    </motion.span>
  );
}

function HeadlineLines({ variant }: { variant: "front" | "ghost" }) {
  return (
    <>
      {careerHero.lines.map((line, li) => (
        <span key={li} className={cn("block type-mega max-sm:!text-[15.5vw] max-sm:!leading-[0.86]", li === 1 && "sm:pl-[0.06em]")}>
          {line.map((word, wi) => {
            const delay = wordDelays[li][wi];
            return (
              <span key={wi} className="whitespace-nowrap max-sm:block">
                {variant === "front" ? (
                  <>
                    <RevealWord text={word.text} delay={delay} className={wordStyles[word.style]} />
                    {word.suffix && <VersionMark text={word.suffix} delay={delay + 0.45} />}
                  </>
                ) : (
                  <span className="text-hollow">
                    {word.text}
                    {word.suffix && <span className="ml-[0.08em] align-top text-[0.34em]">{word.suffix}</span>}
                  </span>
                )}
                {wi < line.length - 1 && <span className="max-sm:hidden"> </span>}
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}
