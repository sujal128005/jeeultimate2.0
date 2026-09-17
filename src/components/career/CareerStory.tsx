"use client";

import { motion } from "motion/react";
import { careerStory } from "@/data/career";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { FieldScene, useCareerWorld } from "./CareerWorld";

/**
 * Three beats. The text scrolls; the particle field behind it
 * morphs from chaos → terrain → helix as each beat takes the stage.
 */
export function CareerStory() {
  const { activeId } = useCareerWorld();
  const activeIndex = careerStory.findIndex((beat) => `story-${beat.id}` === activeId);

  return (
    <section id="story" aria-labelledby="story-title" className="relative">
      <h2 id="story-title" className="sr-only">
        Our story
      </h2>

      {/* Progress rail */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-gutter z-10 hidden lg:block">
        <div className="sticky top-1/2 flex -translate-y-1/2 flex-col gap-5">
          {careerStory.map((beat, i) => (
            <div key={beat.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "h-px transition-all duration-(--duration-slow) ease-(--ease-out-soft)",
                  i === activeIndex ? "w-10 bg-[var(--cw-accent)]" : "w-4 bg-line-strong",
                )}
              />
              <span className={cn("type-pixel transition-colors duration-(--duration-slow)", i === activeIndex ? "text-fg" : "text-fg-subtle")}>
                {beat.index}
              </span>
            </div>
          ))}
        </div>
      </div>

      {careerStory.map((beat, i) => (
        <FieldScene
          key={beat.id}
          id={`story-${beat.id}`}
          as="div"
          request={{
            formation: beat.formation,
            stage: { x: 1.15, y: 0, scale: i === 1 ? 1.05 : 0.95, dim: 0.95 },
            stageMobile: { x: 0, y: 0.2, scale: 0.72, dim: 0.42 },
            accent: i === 2 ? "#ffb020" : null,
          }}
          className="relative flex min-h-[110svh] items-center px-gutter"
        >
          <motion.article
            // MotionConfig (reducedMotion="user") drops the movement for those who ask
            initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1, ease: ease.expo }}
            className="mx-auto w-full max-w-page lg:pl-24"
          >
            <div className="max-w-[44rem]">
              <p className="flex items-center gap-4 type-pixel text-fg-muted">
                <span className="text-[var(--cw-accent)]">{beat.index}</span>
                <span aria-hidden className="h-px w-10 bg-line-strong" />
                {beat.label}
              </p>
              <h3 className="mt-7 text-[clamp(2.3rem,5.6vw,5.2rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-fg">
                {beat.title}
              </h3>
              <p className="mt-7 max-w-[30rem] type-body-lg text-fg-2">{beat.body}</p>
            </div>
          </motion.article>
        </FieldScene>
      ))}
    </section>
  );
}
