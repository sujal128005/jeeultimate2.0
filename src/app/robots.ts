import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/portal/", "/design-system"] },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
