"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";

const lines = [
  { lead: "Your JEE", word: "Rank." },
  { lead: "Your", word: "College." },
  { lead: "Your", word: "Strategy.", accent: true },
];

const institutes = ["IIT", "NIT", "IIIT", "GFTI"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden pt-[120px] pb-20 md:pt-[168px] md:pb-28">
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

          <h1
            id="hero-title"
            className="mt-8 type-display text-fg md:mt-10"
          >
            {lines.map((line, index) => (
              <span key={line.word} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: ease.out, delay: 0.25 + index * 0.1 }}
                >
                  <span className="text-fg/45">{line.lead}</span>{" "}
                  <span className={line.accent ? "text-accent-gradient pr-[0.04em]" : undefined}>{line.word}</span>
                </motion.span>
                {index < lines.length - 1 && " "}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.65 }}
            className="mt-7 max-w-measure type-body-lg text-fg-muted md:mt-9"
          >
            Clear, human guidance for IIT, NIT, IIIT and GFTI admissions, from reading your rank to freezing the
            right seat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.75 }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button href="/#counselling" size="lg" icon="arrow-right" className="w-full sm:w-auto">
              Explore counselling
            </Button>
            <Button href="/#why" size="lg" variant="glass" className="w-full sm:w-auto">
              Why JEE Ultimate 2.0
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            aria-label="Institutes we guide for"
            className="mt-10 flex items-center gap-2 type-label text-fg-muted"
          >
            {institutes.map((name, index) => (
              <li key={name} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-fg-subtle" />}
                {name}
              </li>
            ))}
          </motion.ul>
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
