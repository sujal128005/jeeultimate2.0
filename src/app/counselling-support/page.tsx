import type { Metadata } from "next";
import { CounsellingList } from "@/components/counselling/CounsellingList";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { ComingSoon } from "@/components/placeholder/ComingSoon";
import { sectionPages } from "@/data/sections";

const page = sectionPages["counselling-support"];

export const metadata: Metadata = {
  title: page.eyebrow,
  description: page.description,
  alternates: { canonical: page.href },
};

export default function CounsellingSupportPage() {
  return (
    <ComingSoon page={page} showPreview={false}>
      <AnimatedSection delay={0.1}>
        <p className="mb-4 type-label text-fg-muted">Choose your counselling</p>
        <CounsellingList />
      </AnimatedSection>
    </ComingSoon>
  );
}
