"use client";

import { motion } from "motion/react";
import { careerCta } from "@/data/career";
import { ease } from "@/lib/motion";
import { FieldScene } from "./CareerWorld";
import { TalentForm } from "./TalentForm";

export function TalentNetwork() {
  return (
    <FieldScene
      id="join"
      request={{
        formation: "mark",
        stage: { x: -1.3, y: 0.66, scale: 0.5, dim: 1 },
        stageMobile: { x: 0, y: 1.45, scale: 0.55, dim: 0.6 },
        accent: "#ffb020",
      }}
      aria-labelledby="join-title"
      className="relative px-gutter pt-section pb-section-sm"
    >
      <div className="mx-auto grid max-w-page items-end gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="pt-[30vh] lg:col-span-6 lg:pt-[40vh]">
          <p className="type-pixel text-fg-muted">The talent network</p>
          <h2 id="join-title" className="mt-6 type-mega !text-[clamp(3rem,8.4vw,7.8rem)] text-fg">
            {careerCta.title.map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1, ease: ease.expo, delay: i * 0.12 }}
              >
                {i === 1 ? <span className="text-hollow">{line}</span> : line}
              </motion.span>
            ))}
          </h2>
          <p className="mt-8 max-w-[28rem] type-body-lg text-fg-2">{careerCta.body}</p>
        </div>
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: ease.expo, delay: 0.15 }}
        >
          <TalentForm />
        </motion.div>
      </div>
    </FieldScene>
  );
}
