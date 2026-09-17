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
        <StatusBadge className="mt-10">Full story coming in the next phase</StatusBadge>
      </AnimatedSection>
    </PageShell>
  );
}
