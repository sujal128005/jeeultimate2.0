import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CounsellingList } from "@/components/counselling/CounsellingList";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { PageShell } from "@/components/placeholder/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { counsellingProcesses, getCounselling } from "@/data/counselling";

export const dynamicParams = false;

export function generateStaticParams() {
  return counsellingProcesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/counselling/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const process = getCounselling(slug);
  if (!process) return {};
  return {
    title: `${process.name} Counselling`,
    description: `${process.fullName} (${process.name}): ${process.summary}`,
    alternates: { canonical: process.href },
  };
}

export default async function CounsellingPage(props: PageProps<"/counselling/[slug]">) {
  const { slug } = await props.params;
  const process = getCounselling(slug);
  if (!process) notFound();

  const siblings = counsellingProcesses.filter((p) => p.slug !== process.slug);

  return (
    <PageShell>
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

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label text-fg-muted">{process.fullName}</p>
            <h1 className="mt-4 text-[clamp(4rem,13vw,10.5rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
              {process.name}
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="type-body-lg text-fg-2">{process.summary}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              <Chip tone="brand">{process.scope}</Chip>
              <Chip>{process.basis}</Chip>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="mt-16 grid gap-10 border-t border-line pt-12 md:mt-24 lg:grid-cols-12">
        <AnimatedSection className="lg:col-span-4">
          <StatusBadge>Guide coming in the next phase</StatusBadge>
          <h2 className="mt-6 type-h3">
            What this guide will cover
          </h2>
          <p className="mt-3 type-body text-fg-muted">
            A step-by-step walkthrough of {process.name}, written for students and parents.
          </p>
          <dl className="mt-8 flex flex-col gap-4 type-body-sm">
            <div>
              <dt className="text-fg-muted">Covers</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {process.covers.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </dd>
            </div>
          </dl>
        </AnimatedSection>

        <Stagger as="ol" className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
          {process.chapters.map((chapter, index) => (
            <StaggerItem
              as="li"
              key={chapter}
              className="flex min-h-[132px] flex-col justify-between rounded-card bg-surface/70 p-5 shadow-hairline"
            >
              <div className="flex items-center justify-between">
                <span className="type-meta text-accent-text tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Badge>Soon</Badge>
              </div>
              <p className="type-body-lg font-semibold tracking-[-0.025em]">{chapter}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatedSection className="mt-24 md:mt-32">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-h3">Other counselling</h2>
          <Button href="/counselling-support" variant="glass" size="sm" icon="arrow-right">
            Counselling support
          </Button>
        </div>
        <CounsellingList items={siblings} />
      </AnimatedSection>
    </PageShell>
  );
}
