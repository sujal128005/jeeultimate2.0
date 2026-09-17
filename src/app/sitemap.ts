import type { MetadataRoute } from "next";
import { counsellingProcesses } from "@/data/counselling";
import { mainNav } from "@/data/navigation";
import { site } from "@/data/site";
import { getAllNewsSlugs } from "@/lib/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const paths = [
    "/",
    ...mainNav.map((item) => item.href),
    ...counsellingProcesses.map((item) => item.href),
    "/news",
    ...(await getAllNewsSlugs()).map((slug) => `/news/${slug}`),
    "/testimonials",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return paths.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
