import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { NewsVisual } from "@/components/news/NewsVisual";
import { PageShell } from "@/components/placeholder/PageShell";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import { getAllNewsSlugs, getNewsItem } from "@/lib/news";

export async function generateStaticParams() {
  return (await getAllNewsSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getNewsItem(slug);
  if (!item) return {};
  return { title: item.title, description: item.excerpt, alternates: { canonical: item.href } };
}

export default async function NewsArticlePage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const item = await getNewsItem(slug);
  if (!item) notFound();

  return (
    <PageShell>
      <AnimatedSection as="article" className="mx-auto max-w-[820px]">
        <Button href="/news" variant="ghost" size="sm" leadingIcon="arrow-left" className="-ml-3">
          All updates
        </Button>
        <p className="mt-8 flex items-center gap-2 type-meta text-fg-muted">
          <span className="font-medium text-accent-text">{item.category}</span>
          <span aria-hidden className="size-[3px] rounded-full bg-fg-subtle" />
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
          <span aria-hidden className="size-[3px] rounded-full bg-fg-subtle" />
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="size-3" />
            {item.readingMinutes} min
          </span>
        </p>
        <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          {item.title}
        </h1>
        <p className="mt-6 type-body-lg text-fg-2">{item.excerpt}</p>
        <NewsVisual category={item.category} size="lg" className="relative mt-10 aspect-[16/8] rounded-panel" />

        {item.body?.length ? (
          <>
            <div className="mt-12 flex flex-col gap-11">
              {item.body.map((section) => (
                <section key={section.heading}>
                  <h2 className="type-h3">{section.heading}</h2>
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-5 type-body-lg text-fg-2">
                      {p}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-6 flex flex-col gap-3">
                      {section.list.map((li) => (
                        <li key={li} className="flex items-start gap-3 type-body text-fg-2">
                          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <p className="mt-6 flex gap-3 rounded-card bg-accent-soft/50 p-5 type-body-sm text-fg-2 ring-1 ring-accent/20">
                      <Icon name="info" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                      {section.note}
                    </p>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-14 border-t border-line pt-7">
              <p className="type-label text-fg-muted">Check it yourself</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(item.sources ?? []).map((src) => {
                  const external = src.href.startsWith("http");
                  return (
                    <li key={src.href}>
                      <a
                        href={src.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface px-4 type-caption font-semibold shadow-hairline hover:bg-surface-2"
                      >
                        {src.label}
                        <Icon name={external ? "arrow-up-right" : "arrow-right"} className="size-3.5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
              {item.checkedOn && (
                <p className="mt-6 type-caption text-fg-muted">
                  Written by the JEE Ultimate 2.0 team. Last read against the official source on{" "}
                  <time dateTime={item.checkedOn}>{formatDate(item.checkedOn)}</time>. Dates, rules and seat numbers are
                  set by the counselling authority and can change, so treat the official portal as the final word.
                </p>
              )}
            </div>
          </>
        ) : (
          <StatusBadge className="mt-10">Full story coming in the next phase</StatusBadge>
        )}
      </AnimatedSection>
    </PageShell>
  );
}
