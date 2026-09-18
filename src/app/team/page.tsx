import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { TeamBoard } from "@/components/team/TeamBoard";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { socialLinks } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind JEE Ultimate 2.0: Shivam Raj, Ashu Kumar and Sujal Negi, and the Career world where the open roles live.",
  alternates: { canonical: "/team" },
};

const marquee = ["counsellors", "editors", "engineers", "mentors", "designers", "storytellers"];

export default function TeamPage() {
  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[620px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-34%] -left-20 h-[480px] w-[720px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ju-brand-300)_22%,transparent),transparent)]" />
        <div className="absolute top-[-10%] right-[-10%] h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ju-brand-200)_26%,transparent),transparent)]" />
      </div>

      {/* The page opens on the crew, so the only heading is one for screen readers. */}
      <h1 className="sr-only">The JEE Ultimate 2.0 team</h1>

      {/* A strip of what the crew is made of, sliding past */}
      <div aria-hidden className="relative mt-[92px] mb-1 overflow-hidden border-y border-line py-3 md:mt-[112px]">
        <div className="marquee-track flex w-max gap-10 pr-10">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-10">
              {marquee.map((word) => (
                <span key={word} className="inline-flex items-center gap-10 type-h4 text-fg-subtle">
                  {word}
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Section spacing="sm" id="founders">
        <TeamBoard />
      </Section>

      <Section spacing="sm">
        <AnimatedSection className="relative isolate overflow-hidden rounded-section bg-contrast p-8 text-on-contrast sm:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 -right-16 size-[26rem] rounded-full bg-accent opacity-25 blur-[110px]" />
          </div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[34rem]">
              <p className="type-label text-on-contrast/60">Want a seat?</p>
              <h2 className="mt-4 type-h2">The Career world has the full brief.</h2>
              <p className="mt-4 type-body text-on-contrast/70">
                Every open role, what the work actually is, and the talent network to join while applications open.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/career"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-on-contrast px-6 type-button text-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
                >
                  Enter Career
                  <Icon name="arrow-right" className="size-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-full px-6 type-button text-on-contrast ring-1 ring-on-contrast/25 hover:ring-on-contrast/50"
                >
                  Say hello
                </Link>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 type-caption font-semibold text-on-contrast/80 ring-1 ring-on-contrast/20 transition-colors hover:text-on-contrast hover:ring-on-contrast/45"
                  >
                    {s.label}
                    <Icon name="arrow-up-right" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </Section>
    </div>
  );
}
