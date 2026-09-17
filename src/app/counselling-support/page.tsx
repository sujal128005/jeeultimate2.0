import type { Metadata } from "next";
import { ChoiceFillingDemo } from "@/components/counselling-hub/ChoiceFillingDemo";
import { ComparisonTable } from "@/components/counselling-hub/ComparisonTable";
import { CounsellingStatusBoard } from "@/components/counselling-hub/CounsellingCalendar";
import { CounsellingChooser } from "@/components/counselling-hub/CounsellingChooser";
import { HubHero } from "@/components/counselling-hub/HubHero";
import { JourneyStepper } from "@/components/counselling-hub/JourneyStepper";
import { MembersCta } from "@/components/counselling-hub/MembersCta";
import { ResourceHub } from "@/components/counselling-hub/ResourceHub";
import { TermsExplorer } from "@/components/counselling-hub/TermsExplorer";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { PageShell } from "@/components/placeholder/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { calendarYear } from "@/data/counselling-calendar";
import { choiceFilling } from "@/data/counselling-hub";

export const metadata: Metadata = {
  title: "Counselling Support",
  description:
    "JoSAA, CSAB, UPTAC and JAC Delhi counselling made simple: find the right counselling, see every date, understand the terms and get direct support.",
  alternates: { canonical: "/counselling-support" },
};

export default function CounsellingSupportPage() {
  return (
    <>
      {/* 1 · Hero */}
      <PageShell>
        <HubHero />
      </PageShell>

      {/* 2 + 3 · Counselling selection and "Which counselling is for me?" */}
      <Section spacing="none" className="pb-section-sm">
        <CounsellingChooser />
      </Section>

      {/* 4 · Status and calendar */}
      <Section id="status" spacing="sm" className="scroll-mt-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Status & dates"
            title="Where every counselling stands."
            description={`The current status of each counselling and its full ${calendarYear} calendar. Pick a counselling, then tap any date.`}
          />
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="mt-heading-gap">
          <CounsellingStatusBoard />
        </AnimatedSection>
      </Section>

      {/* 5 · Journey */}
      <Section id="journey" spacing="sm" className="scroll-mt-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow="The counselling journey"
            title="Seven steps from rank to seat."
            description="Every counselling follows the same path. Walk through each step to see what happens, what you need to do and what to watch out for."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="mt-heading-gap">
          <JourneyStepper />
        </AnimatedSection>
      </Section>

      {/* 7 · Choice filling */}
      <Section id="choice-filling" spacing="sm" className="scroll-mt-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <AnimatedSection>
              <SectionHeading eyebrow="Why choice filling matters" title={choiceFilling.title} description={choiceFilling.body} />
            </AnimatedSection>
            <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2">
              {choiceFilling.reasons.map((r, i) => (
                <StaggerItem as="li" key={r.title} className="rounded-card bg-surface p-5 shadow-hairline">
                  <span className="type-meta text-accent-text tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 type-body font-semibold">{r.title}</p>
                  <p className="mt-1 type-body-sm text-fg-muted">{r.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <AnimatedSection delay={0.1} className="lg:sticky lg:top-28 lg:col-span-7">
            <ChoiceFillingDemo />
          </AnimatedSection>
        </div>
      </Section>

      {/* 9 · Terms */}
      <Section id="terms" spacing="sm" className="scroll-mt-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Counselling terms"
            title="The words you’ll hear, explained."
            description="Pick a term to see what it means, with a quick example."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="mt-heading-gap">
          <TermsExplorer />
        </AnimatedSection>
      </Section>

      {/* 10 · Resources */}
      <Section id="resources" spacing="sm" className="scroll-mt-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Counselling resources"
            title="The right link, for your counselling."
            description="Choose a counselling in any card to get its guide, checklist, seat matrix, cutoffs or official website."
          />
        </AnimatedSection>
        <div className="mt-heading-gap">
          <ResourceHub />
        </div>
      </Section>

      {/* 12 · Comparison */}
      <Section id="compare" spacing="sm" className="scroll-mt-20">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Comparison"
            title="JoSAA, CSAB, UPTAC and JAC Delhi, side by side."
            description={`Purpose, colleges, eligibility and timing at a glance. Figures are from the ${calendarYear} cycle.`}
          />
        </AnimatedSection>
        <AnimatedSection delay={0.1} className="mt-heading-gap">
          <ComparisonTable />
        </AnimatedSection>
      </Section>

      {/* 13 · Members */}
      <Section id="members" spacing="sm" className="scroll-mt-20 pb-section">
        <MembersCta />
      </Section>
    </>
  );
}
