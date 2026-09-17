import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { Counter } from "@/components/motion/Counter";
import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { institutesCovered } from "@/data/colleges";
import { credibility } from "@/data/home";
import { site } from "@/data/site";

/** About JEE Ultimate 2.0 + credibility. The one dark "slab" on the homepage. */
export function Stats() {
  return (
    <section id="about" aria-labelledby="about-title" className="px-3 py-6 md:px-5 md:py-10">
      <div className="relative isolate mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-contrast text-on-contrast md:rounded-section">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-56 -z-10 glow-accent-strong h-[520px] w-[720px] rounded-full opacity-80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--on-contrast)_4%,transparent)_1px,transparent_1px)] [background-size:120px_100%]"
        />

        <Container size="wide" className="py-section-sm md:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <AnimatedSection className="lg:col-span-7">
              <Eyebrow tone="dark">About JEE Ultimate 2.0</Eyebrow>
              <h2
                id="about-title"
                className="mt-6 type-display"
              >
                <span className="text-on-contrast/45">Since</span> {site.since}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="lg:col-span-5">
              <p className="max-w-[30rem] type-lead font-normal text-on-contrast/70">
                {credibility.intro}
              </p>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.05} className="mt-16 border-t border-on-contrast/10 pt-12 md:mt-24 md:pt-16">
            <p className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
              <Counter
                value={site.alumni}
                suffix="+"
                className="text-accent-gradient type-stat-xl"
              />{" "}
              <span className="max-w-[26rem] pb-2 type-h3 font-medium text-on-contrast md:pb-4">
                IITians, NITians, IIITians &amp; GFTIans produced.
              </span>
            </p>
          </AnimatedSection>

          <Stagger
            as="ul"
            className="mt-14 grid divide-y divide-on-contrast/10 border-y border-on-contrast/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:mt-20"
          >
            {credibility.facts.map((fact) => (
              <StaggerItem as="li" key={fact.label} className="py-7 sm:px-6 sm:first:pl-0 md:py-10 lg:px-10">
                <Stat
                  tone="contrast"
                  value={fact.value === "institutes" ? `${institutesCovered}+` : fact.value}
                  label={fact.label}
                  detail={fact.detail}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </div>
    </section>
  );
}
