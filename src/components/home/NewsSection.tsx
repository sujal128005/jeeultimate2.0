import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLatestNews, isSampleNews } from "@/lib/news";

/** Server component - fetches through the news data layer. */
export async function NewsSection() {
  const news = await getLatestNews(5);
  const featured = news.find((item) => item.featured) ?? news[0];
  const rest = news.filter((item) => item.slug !== featured?.slug).slice(0, 4);

  if (!featured) return null;

  return (
    <section id="news" aria-labelledby="news-title" className="pb-section">
      <Container size="wide">
        <AnimatedSection className="mb-heading-gap flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="news-title"
            eyebrow="Updates"
            title={
              <>
                Latest JEE &amp;
                <br /> counselling news
              </>
            }
            description={
              isSampleNews
                ? "Explainers and updates from the counselling season. Sample stories shown, live updates are on the way."
                : "Explainers and updates from the counselling season."
            }
          />
          <Button href="/news" variant="glass" icon="arrow-right" className="self-start md:self-auto">
            All updates
          </Button>
        </AnimatedSection>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <AnimatedSection className="lg:col-span-7">
            <NewsCard item={featured} variant="featured" />
          </AnimatedSection>

          <div className="lg:col-span-5">
            <h3 className="mb-3 type-label text-fg-muted">Latest</h3>
            <Stagger as="ul" className="flex flex-col divide-y divide-line">
              {rest.map((item) => (
                <StaggerItem as="li" key={item.slug} className="py-2">
                  <NewsCard item={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
