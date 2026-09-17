import { ClosingCTA } from "@/components/home/ClosingCTA";
import { CounsellingSection } from "@/components/home/CounsellingSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { Hero } from "@/components/home/Hero";
import { NewsSection } from "@/components/home/NewsSection";
import { Stats } from "@/components/home/Stats";
import { WhyJEEUltimate } from "@/components/home/WhyJEEUltimate";

/**
 * Homepage narrative:
 * promise → proof → purpose → action → reasons → what's new → invitation
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeatureSection />
      <CounsellingSection />
      <WhyJEEUltimate />
      <NewsSection />
      <ClosingCTA />
    </>
  );
}
