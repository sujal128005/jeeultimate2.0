"use client";

import { LayoutGroup } from "motion/react";
import { useState } from "react";
import { StaggerItem, Stagger } from "@/components/motion/AnimatedSection";
import { counsellingProcesses } from "@/data/counselling";
import { CounsellingCard } from "./CounsellingCard";
import { CounsellingPreview } from "./CounsellingPreview";

/** Interactive list of counselling processes with a live preview panel. */
export function CounsellingExplorer({ id = "counselling" }: { id?: string }) {
  const [activeSlug, setActiveSlug] = useState(counsellingProcesses[0].slug);
  const active = counsellingProcesses.find((p) => p.slug === activeSlug) ?? counsellingProcesses[0];

  return (
    <LayoutGroup id={id}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Stagger as="ul" className="divide-y divide-line lg:col-span-7 lg:divide-y-0">
          {counsellingProcesses.map((process, index) => (
            <StaggerItem as="li" key={process.slug}>
              <CounsellingCard
                process={process}
                index={index}
                active={process.slug === activeSlug}
                onActivate={() => setActiveSlug(process.slug)}
                layoutGroup={id}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <CounsellingPreview process={active} />
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
