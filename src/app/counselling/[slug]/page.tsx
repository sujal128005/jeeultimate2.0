import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CounsellingCalendar } from "@/components/counselling-hub/CounsellingCalendar";
import { DocumentsChecklist } from "@/components/counselling-hub/DocumentsChecklist";
import { CounsellingList } from "@/components/counselling/CounsellingList";
import { JourneyLinks } from "@/components/journey/JourneyLinks";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { counsellingProcesses, getCounselling } from "@/data/counselling";
import { formatPrice } from "@/lib/format";
import type { CounsellingProcess } from "@/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return counsellingProcesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/counselling/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const process = getCounselling(slug);
  if (!process) return {};
  return {
    title: `${process.name} Counselling Support`,
    description: `${process.fullName} (${process.name}): dates, eligibility, documents, seat matrix and direct enrolment. ${process.summary}`,
    alternates: { canonical: process.href },
  };
}

const sections = [
  { id: "enrol", label: "Enrol" },
  { id: "dates", label: "Dates" },
  { id: "eligibility", label: "Eligibility" },
  { id: "documents", label: "Documents" },
  { id: "seat-matrix", label: "Seats & cutoffs" },
];

export default async function CounsellingPage(props: PageProps<"/counselling/[slug]">) {
  const { slug } = await props.params;
  const process = getCounselling(slug);
  if (!process) notFound();

  const { theme } = process;
  const siblings = counsellingProcesses.filter((p) => p.slug !== process.slug);

  return (
    <div style={{ "--c": theme.accent, "--g": theme.glow, "--ink": theme.ink } as React.CSSProperties}>
      {/* Hero */}
      <header className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px]">
          <div className="bg-grid mask-radial absolute inset-0" />
          <div className="absolute -top-56 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--c)_22%,transparent),transparent)]" />
          <div className="absolute top-40 -right-40 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--g)_16%,transparent),transparent)]" />
        </div>
        <Container size="wide" className="pt-[112px] md:pt-[150px]">
          <AnimatedSection>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 type-caption text-fg-muted">
                <li>
                  <Link href="/counselling-support" className="transition-colors hover:text-fg">
                    Counselling Support
                  </Link>
                </li>
                <li aria-hidden>
                  <Icon name="chevron-right" className="size-3.5" />
                </li>
                <li aria-current="page" className="font-medium text-fg">
                  {process.name}
                </li>
              </ol>
            </nav>
          </AnimatedSection>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <AnimatedSection className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 type-label text-[var(--ink)]">
                <span className="grid size-7 place-items-center rounded-lg text-white" style={{ background: `linear-gradient(140deg, ${theme.accent}, ${theme.glow})` }}>
                  <Icon name={process.icon} className="size-4" />
                </span>
                {process.fullName}
              </p>
              <h1 className="mt-5 bg-[linear-gradient(120deg,var(--fg)_30%,var(--c)_75%,var(--g))] bg-clip-text pb-2 text-[clamp(4rem,12vw,9.5rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-transparent">
                {process.name}
              </h1>
              <p className="mt-6 max-w-[36rem] type-body-lg text-fg-2">{process.summary}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                <a
                  href="#enrol"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--c),color-mix(in_oklab,var(--c)_60%,var(--g)))] pr-2 pl-6 type-button text-white shadow-[0_14px_30px_-14px_var(--c)] transition-transform active:scale-[0.97]"
                >
                  Enrol for {process.name} support
                  <span className="grid size-8 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-y-0.5">
                    <Icon name="arrow-down" className="size-4" />
                  </span>
                </a>
                <a
                  href="#dates"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-surface px-5 type-button shadow-hairline transition-colors hover:bg-surface-2"
                >
                  <Icon name="calendar-days" className="size-4 text-[var(--ink)]" />
                  Key dates
                </a>
              </div>
            </AnimatedSection>

            <Stagger as="ul" className="grid grid-cols-2 gap-2.5 lg:col-span-5">
              {process.facts.map((f) => (
                <StaggerItem as="li" key={f.label} className="rounded-card bg-surface/80 p-4 shadow-hairline backdrop-blur">
                  <p className="type-caption text-fg-muted">{f.label}</p>
                  <p className="mt-1.5 text-[1.9rem] leading-none font-semibold tracking-[-0.04em] text-[var(--ink)] tabular-nums">
                    {f.value}
                  </p>
                  {f.note && <p className="mt-2 type-caption text-fg-muted">{f.note}</p>}
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <nav aria-label="On this page" className="mt-12 border-t border-line pt-5">
            <ul className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {sections.map((s) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    className="inline-flex h-9 items-center rounded-full px-4 type-nav text-fg-muted ring-1 ring-line transition-colors hover:bg-[color-mix(in_oklab,var(--c)_8%,transparent)] hover:text-[var(--ink)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>

      <Container size="wide" className="grid grid-cols-1 gap-section-sm py-section-sm">
        <EnrolSection process={process} siblings={siblings} />

        <Block id="dates" eyebrow="Key dates" title={`The ${process.name} calendar.`}>
          <CounsellingCalendar slug={process.slug} />
        </Block>

        <Block id="eligibility" eyebrow="Eligibility" title="Who can take part, and what to keep in mind.">
          <div className="grid gap-3 lg:grid-cols-2">
            <InfoList icon="shield" title="Eligibility" items={process.eligibility} />
            <InfoList icon="alert" title="Important considerations" items={process.considerations} />
          </div>
        </Block>

        <Block id="documents" eyebrow="Documents checklist" title="Keep these ready before you report.">
          <DocumentsChecklist process={process} />
        </Block>

        <Block id="seat-matrix" eyebrow="Seats, cutoffs & official links" title="Straight from the official source.">
          <Link
            href={`/colleges?counselling=${process.slug}`}
            className="group mb-3 flex items-center gap-4 rounded-card bg-[linear-gradient(120deg,color-mix(in_oklab,var(--c)_14%,var(--color-surface)),var(--color-surface))] p-5 shadow-hairline transition-[transform,box-shadow] duration-(--duration-base) hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--c)] text-white">
              <Icon name="landmark" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block type-body font-semibold">Participating colleges</span>
              <span className="mt-0.5 block type-body-sm text-fg-muted">
                Browse, save and compare every college in {process.name} on JEE Ultimate 2.0.
              </span>
            </span>
            <Icon
              name="arrow-right"
              className="size-5 shrink-0 text-[var(--ink)] transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <OfficialLink icon="layers" title="Seat matrix" body="Seats by institute and branch." href={process.links.seatMatrix} />
            <OfficialLink icon="chart" title="Opening & closing ranks" body="Past rounds and years." href={process.links.cutoffs} />
            <OfficialLink icon="file" title="Brochure & rules" body="Official rules and notices." href={process.links.brochure} />
            <OfficialLink icon="landmark" title="Official website" body="Login, schedule and updates." href={process.links.official} />
          </ul>
          {process.links.extra && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {process.links.extra.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface px-4 type-caption font-semibold text-[var(--ink)] shadow-hairline hover:bg-surface-2"
                  >
                    {l.label}
                    <Icon name="arrow-up-right" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 type-caption text-fg-muted">{process.sourceNote}</p>
        </Block>

        <AnimatedSection>
          <JourneyLinks
            current="counselling"
            hrefs={{
              colleges: `/colleges?counselling=${process.slug}`,
              cutoffs: `/previous-cutoffs?counselling=${process.slug}`,
              predictor: `/ai-predictor?counselling=${process.slug}`,
            }}
          />
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-h3">Other counselling</h2>
            <Link
              href="/counselling-support"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface px-4 type-caption font-semibold shadow-hairline hover:bg-surface-2"
            >
              All counselling support
              <Icon name="arrow-right" className="size-3.5" />
            </Link>
          </div>
          <CounsellingList items={siblings} />
        </AnimatedSection>
      </Container>
    </div>
  );
}

function Block({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <AnimatedSection>
        <p className="inline-flex items-center gap-2 type-label text-fg-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--c)]" />
          {eyebrow}
        </p>
        <h2 id={`${id}-title`} className="mt-4 max-w-[40rem] type-h2">
          {title}
        </h2>
      </AnimatedSection>
      <AnimatedSection delay={0.08} className="mt-8">
        {children}
      </AnimatedSection>
    </section>
  );
}

function InfoList({ icon, title, items }: { icon: IconName; title: string; items: string[] }) {
  return (
    <div className="rounded-panel bg-surface p-6 shadow-hairline sm:p-7">
      <p className="flex items-center gap-2 type-h4">
        <Icon name={icon} className="size-5 text-[var(--ink)]" />
        {title}
      </p>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 type-body-sm text-fg-2">
            <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--c)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OfficialLink({ icon, title, body, href }: { icon: IconName; title: string; body: string; href: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col rounded-card bg-surface p-5 shadow-hairline transition-[transform,box-shadow] duration-(--duration-base) hover:-translate-y-0.5 hover:shadow-card"
      >
        <span className="flex items-center justify-between">
          <span className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--c)_10%,transparent)] text-[var(--ink)]">
            <Icon name={icon} className="size-5" />
          </span>
          <Icon
            name="arrow-up-right"
            className="size-4 text-fg-subtle transition-[transform,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--ink)]"
          />
        </span>
        <span className="mt-5 type-body font-semibold">{title}</span>
        <span className="mt-1 type-body-sm text-fg-muted">{body}</span>
        <span className="sr-only">(opens the official website in a new tab)</span>
      </a>
    </li>
  );
}

function EnrolSection({ process, siblings }: { process: CounsellingProcess; siblings: CounsellingProcess[] }) {
  const { plan } = process;
  return (
    <section id="enrol" aria-labelledby="enrol-title" className="scroll-mt-24">
      <AnimatedSection className="relative isolate overflow-hidden rounded-section bg-contrast p-6 text-on-contrast sm:p-10 lg:p-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-20 size-[30rem] rounded-full bg-[var(--c)] opacity-40 blur-[110px]" />
          <div className="absolute -bottom-48 -left-24 size-[26rem] rounded-full bg-[var(--g)] opacity-25 blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 type-label text-on-contrast/60">
              <Icon name="ticket" className="size-4 text-[var(--g)]" />
              Direct enrolment
            </p>
            <h2 id="enrol-title" className="mt-5 type-h1 text-on-contrast">
              {plan.name}
            </h2>
            <ul className="mt-8 grid gap-3">
              {plan.includes.map((item) => (
                <li key={item} className="flex gap-3 type-body text-on-contrast/80">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--c)] text-white">
                    <Icon name="check" className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-3xl bg-on-contrast/[0.06] p-6 ring-1 ring-on-contrast/12 backdrop-blur sm:p-8">
              <p className="type-label text-on-contrast/55">{process.name} support fee</p>
              <p className="mt-3 text-[clamp(2.4rem,5vw,3.4rem)] leading-none font-semibold tracking-[-0.045em]">
                {plan.price !== null ? formatPrice(plan.price) : "Coming soon"}
              </p>
              <p className="mt-2 type-body-sm text-on-contrast/55">
                {plan.price !== null ? "One-time fee for this counselling." : "Price announced soon."}
              </p>
              {plan.href ? (
                <a
                  href={plan.href}
                  className="group mt-7 flex h-14 w-full items-center justify-between rounded-full bg-white pr-2 pl-6 text-[16px] font-semibold text-[var(--ink)] transition-transform active:scale-[0.98]"
                >
                  Enrol now
                  <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(140deg,var(--c),var(--g))] text-white transition-transform group-hover:translate-x-0.5">
                    <Icon name="arrow-right" className="size-4" />
                  </span>
                </a>
              ) : (
                <span
                  role="button"
                  aria-disabled="true"
                  className="mt-7 flex h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-on-contrast/20 text-[15px] font-semibold text-on-contrast/60"
                >
                  <Icon name="lock" className="size-4" />
                  Enrolment opens soon
                </span>
              )}
              <div className="mt-6 border-t border-on-contrast/10 pt-5">
                <p className="type-caption text-on-contrast/50">Need another counselling too?</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {siblings.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`${s.href}#enrol`}
                        className="inline-flex h-8 items-center gap-2 rounded-full bg-on-contrast/[0.07] pr-3 pl-2 type-caption font-medium text-on-contrast/80 ring-1 ring-on-contrast/10 hover:bg-on-contrast/[0.12]"
                      >
                        <span className="size-3 rounded-full" style={{ background: `linear-gradient(140deg, ${s.theme.accent}, ${s.theme.glow})` }} />
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
