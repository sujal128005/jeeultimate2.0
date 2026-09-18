"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { site } from "@/data/site";
import { JoinCounselling } from "./JoinCounselling";
import { ease } from "@/lib/motion";

/**
 * Bhartrihari's Niti Shataka, on what an education is worth. Two of the four
 * lines: the last two end on kings and wealth, and this page is not about
 * either.
 */
const shloka = {
  lines: [
    "विद्या दीपः, ज्ञानं मार्गः।",
    "संस्कारः शक्तिः, सफलता ध्येयम्॥",
  ],
  meaning:
    "“Education is the light, knowledge is the path. Values are the strength, and success is the goal...”",
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden pt-[96px] pb-16 md:pt-[124px] md:pb-20">
      <HeroBackdrop />

      <Container size="wide" className="relative">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: ease.out, delay: 0.15 }}
          >
            <StatusBadge>
              JEE counselling guidance · since {site.since}
            </StatusBadge>
          </motion.div>

          <h1 id="hero-title" className="mt-5 max-w-[24ch] type-shloka text-fg md:mt-6 md:max-w-none">
            {shloka.lines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className={index === 1 ? "text-accent-gradient inline-block pr-[0.06em]" : "inline-block"}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: ease.out, delay: 0.25 + index * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.6 }}
            className="mt-4 max-w-[58ch] type-verse-meaning text-fg-muted md:mt-5"
          >
            {shloka.meaning}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.75 }}
            className="mt-6 flex w-full flex-col items-center gap-3 md:mt-7 md:w-auto md:flex-row"
          >
            <JoinCounselling className="w-full !h-15 !px-9 !text-[17px] md:w-auto" />
            <Button href="/#why" size="lg" variant="glass" className="w-full md:w-auto">
              Why JEE Ultimate 2.0
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.85 }}
            className="mt-7 max-w-measure type-body text-fg-muted"
          >
            Clear, guidance for <strong className="font-semibold text-fg-2">IIT</strong>,{" "}
            <strong className="font-semibold text-fg-2">NIT</strong>,{" "}
            <strong className="font-semibold text-fg-2">IIIT</strong>,{" "}
            <strong className="font-semibold text-fg-2">GFTI</strong> and{" "}
            <strong className="font-semibold text-fg-2">top Engineering college</strong> admissions, from reading your
            rank to freezing the right seat.
          </motion.p>

        </motion.div>

      </Container>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="bg-grid mask-radial absolute inset-0" />
      <div className="glow-accent absolute top-[-18%] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full" />
      <div className="glow-accent-soft absolute top-[38%] left-[8%] h-[420px] w-[520px] rounded-full" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
