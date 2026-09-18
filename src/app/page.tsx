import { ClosingCTA } from "@/components/home/ClosingCTA";
import { CounsellingSection } from "@/components/home/CounsellingSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { WhyJEEUltimate } from "@/components/home/WhyJEEUltimate";

/**
 * Homepage narrative:
 * promise → proof → purpose → action → reasons → invitation
 * (Updates live at /news, linked from the footer's Counselling column.)
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeatureSection />
      <CounsellingSection />
      <WhyJEEUltimate />
      <ClosingCTA />
    </>
  );
}
