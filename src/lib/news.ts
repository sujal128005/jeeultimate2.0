import { sampleNews } from "@/data/news";
import type { NewsItem } from "@/types";

/**
 * News data-access layer.
 *
 * Phase 2: replace the body with a real fetch, e.g.
 *   const res = await fetch(`${process.env.NEWS_API_URL}/posts?limit=${limit}`, {
 *     next: { revalidate: 600 },
 *   });
 *   return (await res.json()).map(toNewsItem);
 *
 * Components only depend on the `NewsItem` type, so nothing else changes.
 */
export async function getLatestNews(limit = 5): Promise<NewsItem[]> {
  return [...sampleNews]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export async function getNewsItem(slug: string): Promise<NewsItem | undefined> {
  return sampleNews.find((item) => item.slug === slug);
}

export async function getAllNewsSlugs(): Promise<string[]> {
  return sampleNews.map((item) => item.slug);
}

/** True while the site is showing sample content rather than live data. */
export const isSampleNews = true;
