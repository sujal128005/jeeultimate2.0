import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { NewsItem } from "@/types";
import { NewsVisual } from "./NewsVisual";

function Meta({ item, className }: { item: NewsItem; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 type-meta text-fg-muted", className)}>
      <span className="font-medium text-accent-text">{item.category}</span>
      <span aria-hidden className="size-[3px] rounded-full bg-fg-subtle" />
      <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
    </p>
  );
}

export function NewsCard({ item, variant = "compact" }: { item: NewsItem; variant?: "featured" | "compact" }) {
  if (variant === "featured") {
    return (
      <article className="group/news relative h-full">
        <Link
          href={item.href}
          className="flex h-full flex-col overflow-hidden rounded-panel bg-surface shadow-card transition-shadow duration-(--duration-slow) hover:shadow-lift"
        >
          <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/8]">
            <NewsVisual
              category={item.category}
              size="lg"
              className="absolute inset-0 transition-transform duration-[1.2s] ease-(--ease-out-soft) group-hover/news:scale-[1.04]"
            />
            <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 type-caption font-medium text-fg">
              Featured
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6 md:p-8">
            <Meta item={item} />
            <h3 className="mt-4 text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-fg">
              {item.title}
            </h3>
            <p className="mt-3 max-w-[40rem] type-body text-fg-muted">{item.excerpt}</p>
            <div className="mt-auto flex items-center justify-between pt-8">
              <span className="inline-flex items-center gap-1.5 type-caption text-fg-muted">
                <Icon name="clock" className="size-3.5" />
                {item.readingMinutes} min read
              </span>
              <span className="inline-flex items-center gap-2 type-body-sm font-medium text-fg">
                Read story
                <span className="grid size-8 place-items-center rounded-full bg-contrast text-accent-on-contrast transition-transform duration-(--duration-base) group-hover/news:translate-x-0.5">
                  <Icon name="arrow-right" className="size-3.5" />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group/news">
      <Link
        href={item.href}
        className="-mx-3 flex items-center gap-4 rounded-lg p-3 transition-colors duration-(--duration-base) hover:bg-surface/80 md:gap-5"
      >
        <NewsVisual
          category={item.category}
          className="relative size-[76px] shrink-0 rounded-md shadow-hairline md:size-[88px]"
        />
        <div className="min-w-0 flex-1">
          <Meta item={item} />
          <h3 className="mt-1.5 line-clamp-2 type-body-lg leading-[1.35] font-semibold tracking-[-0.02em] text-fg">
            {item.title}
          </h3>
        </div>
        <Icon
          name="arrow-up-right"
          className="hidden size-4 shrink-0 text-fg-subtle transition-all duration-(--duration-base) group-hover/news:translate-x-0.5 group-hover/news:-translate-y-0.5 group-hover/news:text-fg sm:block"
        />
      </Link>
    </article>
  );
}
