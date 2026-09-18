import Link from "next/link";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { LEGAL_UPDATED, type LegalSection } from "@/data/legal";

/**
 * A legal page that can actually be read: numbered sections, a contents list
 * that jumps, plain sentences. Written by us, about this site, in the same
 * voice as the rest of it.
 */
export function LegalDoc({ eyebrow, title, sections }: { eyebrow: string; title: string; sections: LegalSection[] }) {
  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px]">
        <div className="bg-grid mask-radial absolute inset-0" />
      </div>

      <Container size="wide" className="relative pt-[112px] pb-20 md:pt-[144px] md:pb-28">
        <AnimatedSection className="max-w-[44rem]">
          <p className="type-label text-fg-muted">{eyebrow}</p>
          <h1 className="mt-6 type-h1">{title}</h1>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 type-caption text-fg-muted shadow-hairline">
            <Icon name="clock" className="size-3.5" />
            Last updated {LEGAL_UPDATED}
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <AnimatedSection as="nav" aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="type-label text-fg-subtle">On this page</p>
            <ol className="mt-4 flex flex-col gap-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2.5 type-body-sm text-fg-muted transition-colors hover:text-fg">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </AnimatedSection>

          <div className="min-w-0">
            {sections.map((s, i) => (
              <AnimatedSection
                as="section"
                key={s.id}
                id={s.id}
                className="scroll-mt-28 border-t border-line pt-8 first:border-t-0 first:pt-0 [&+section]:mt-10"
              >
                <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 type-h4">{s.heading}</h2>
                {s.paras.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 max-w-[46rem] type-body text-fg-muted">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 flex max-w-[46rem] flex-col gap-2.5">
                    {s.list.map((item) => (
                      <li key={item} className="flex gap-3 type-body text-fg-muted">
                        <span aria-hidden className="mt-[11px] size-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </AnimatedSection>
            ))}

            <AnimatedSection className="mt-12 rounded-card bg-surface p-6 shadow-hairline sm:p-7">
              <h2 className="type-h4">Questions about this page</h2>
              <p className="mt-2 max-w-[42rem] type-body-sm text-fg-muted">
                Use the contact page and pick the reason that fits. If something here is wrong or unclear, report it as a problem
                and we treat it as urgent.
              </p>
              <Link
                href="/contact"
                className="group/legal mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-contrast px-5 type-caption font-semibold text-on-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
              >
                Contact us
                <Icon name="arrow-right" className="size-4 transition-transform group-hover/legal:translate-x-0.5" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </div>
  );
}
