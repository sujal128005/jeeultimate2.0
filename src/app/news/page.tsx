import type { Metadata } from "next";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { NewsCard } from "@/components/news/NewsCard";
import { PageShell } from "@/components/placeholder/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getLatestNews, isSampleNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Latest JEE & Counselling News",
  description: "Explainers and updates on JoSAA, CSAB, UPTAC, JAC Delhi and JEE admissions.",
  alternates: { canonical: "/news" },
};

export default async function NewsIndexPage() {
  const news = await getLatestNews(20);
  const [featured, ...rest] = news;

  return (
    <PageShell>
      <AnimatedSection className="flex flex-col gap-6">
        <SectionHeading
          as="h1"
          eyebrow="Updates"
          title="Latest JEE & counselling news"
          description="Explainers and updates from the counselling season."
        />
        {isSampleNews && <StatusBadge className="self-start">Sample stories · live feed coming soon</StatusBadge>}
      </AnimatedSection>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        {featured && (
          <AnimatedSection className="lg:col-span-7">
            <NewsCard item={featured} variant="featured" />
          </AnimatedSection>
        )}
        <Stagger as="ul" className="flex flex-col divide-y divide-line lg:col-span-5">
          {rest.map((item) => (
            <StaggerItem as="li" key={item.slug} className="py-2">
              <NewsCard item={item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </PageShell>
  );
}
