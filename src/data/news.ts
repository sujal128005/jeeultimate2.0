import type { NewsItem } from "@/types";

/**
 * SAMPLE CONTENT - used until the news API is connected.
 * See `src/lib/news.ts` for the data-access layer.
 */
export const sampleNews: NewsItem[] = [
  {
    slug: "freeze-float-slide-explained",
    title: "Freeze, float or slide: choosing the right option after every round",
    excerpt:
      "The seat-acceptance option you pick after each JoSAA round shapes everything that follows. Here is a calm, practical way to think it through.",
    category: "JoSAA",
    publishedAt: "2026-09-12",
    readingMinutes: 6,
    featured: true,
    href: "/news/freeze-float-slide-explained",
  },
  {
    slug: "csab-special-rounds-plan",
    title: "CSAB special rounds: why they deserve a place in your plan",
    excerpt: "Vacant NIT, IIIT and GFTI seats get a second life. What to know before you register.",
    category: "CSAB",
    publishedAt: "2026-09-08",
    readingMinutes: 4,
    href: "/news/csab-special-rounds-plan",
  },
  {
    slug: "uptac-for-jee-main-aspirants",
    title: "UPTAC counselling, explained for JEE Main aspirants",
    excerpt: "How Uttar Pradesh’s state counselling works and where it fits alongside JoSAA.",
    category: "UPTAC",
    publishedAt: "2026-09-03",
    readingMinutes: 5,
    href: "/news/uptac-for-jee-main-aspirants",
  },
  {
    slug: "jac-delhi-universities-compared",
    title: "JAC Delhi: understanding DTU, NSUT, IIIT-Delhi, IGDTUW and DSEU",
    excerpt: "Five universities, one counselling. A clear look at how they differ.",
    category: "JAC Delhi",
    publishedAt: "2026-08-29",
    readingMinutes: 7,
    href: "/news/jac-delhi-universities-compared",
  },
  {
    slug: "branch-or-college",
    title: "Branch or college? A practical way to decide",
    excerpt: "The oldest question in JEE counselling, broken into questions you can actually answer.",
    category: "Strategy",
    publishedAt: "2026-08-24",
    readingMinutes: 5,
    href: "/news/branch-or-college",
  },
];
