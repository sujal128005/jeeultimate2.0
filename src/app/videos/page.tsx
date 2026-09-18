import type { Metadata } from "next";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { JourneyLinks } from "@/components/journey/JourneyLinks";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedVideos, ShortsRail } from "@/components/videos/VideoPlayers";
import { CHANNEL_URL, getChannelVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch the latest JEE Ultimate 2.0 videos and Shorts: counselling walkthroughs, choice filling, cutoffs and straight answers for JEE aspirants.",
  alternates: { canonical: "/videos" },
};

/** The channel is re-read once an hour. */
export const revalidate = 300;

export default async function VideosPage() {
  const { long, shorts, ok } = await getChannelVideos();
  const empty = !ok || (long.length === 0 && shorts.length === 0);

  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[560px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-32%] left-1/2 h-[520px] w-[960px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_16%,transparent),transparent)]" />
      </div>

      <Container size="wide" className="relative pt-[120px] pb-6 md:pt-[150px]">
        <AnimatedSection className="max-w-[46rem]">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 type-meta shadow-hairline">
            <span className="size-1.5 rounded-full bg-[#ff0033]" />
            On YouTube
          </span>
          <h1 className="mt-6 type-h1">
            Watch it, then
            <br />
            do it.
          </h1>
          <p className="mt-6 max-w-[34rem] type-body-lg text-fg-muted">
            Counselling is easier to follow when you can see the screen. The newest long videos and Shorts from our
            channel land here on their own, an hour after we post them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-contrast px-6 type-button text-on-contrast shadow-button transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
            >
              Open the channel
              <Icon name="arrow-up-right" className="size-4" />
            </a>
            <a
              href={`${CHANNEL_URL}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-surface px-6 type-button shadow-hairline hover:bg-surface-2"
            >
              Subscribe
            </a>
          </div>
        </AnimatedSection>
      </Container>

      {empty ? (
        <Section spacing="sm">
          <div className="rounded-section bg-surface p-8 text-center shadow-hairline sm:p-12">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-text mx-auto">
              <Icon name="alert" className="size-5" />
            </span>
            <h2 className="mt-5 type-h3">The channel did not load just now.</h2>
            <p className="mx-auto mt-3 max-w-[30rem] type-body text-fg-muted">
              This page reads YouTube directly, so a hiccup there shows up here. The videos are all on the channel in
              the meantime.
            </p>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-contrast px-6 type-button text-on-contrast shadow-button"
            >
              Watch on YouTube
              <Icon name="arrow-up-right" className="size-4" />
            </a>
          </div>
        </Section>
      ) : (
        <>
          {long.length > 0 && (
            <Section spacing="sm" id="latest">
              <AnimatedSection>
                <SectionHeading
                  eyebrow="Latest videos"
                  title="The long ones."
                  description="Full walkthroughs: choice filling, seat allotment, cutoffs and the decisions in between."
                />
              </AnimatedSection>
              <div className="mt-10">
                <FeaturedVideos videos={long} />
              </div>
            </Section>
          )}

          {shorts.length > 0 && (
            <Section spacing="sm" id="shorts">
              <AnimatedSection>
                <SectionHeading
                  eyebrow="Shorts"
                  title="One answer, one minute."
                  description="Quick answers to the questions that come up most in counselling season."
                />
              </AnimatedSection>
              <div className="mt-10">
                <ShortsRail videos={shorts} />
              </div>
            </Section>
          )}

          <Section spacing="sm">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start justify-between gap-6 rounded-section bg-contrast p-8 text-on-contrast shadow-card transition-transform duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-0.5 sm:flex-row sm:items-center sm:p-10"
            >
              <div>
                <p className="type-label text-on-contrast/60">More on the channel</p>
                <p className="mt-3 type-h3">Every video, in one place.</p>
                <p className="mt-2 type-body text-on-contrast/70">
                  Playlists for JoSAA, CSAB, UPTAC and JAC Delhi, plus everything we post through the season.
                </p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-on-contrast text-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:scale-110">
                <Icon name="arrow-up-right" className="size-5" />
              </span>
            </a>
          </Section>
        </>
      )}

      <Container size="wide" className="relative pb-section">
        <JourneyLinks current="counselling" title="While you are here" />
      </Container>
    </div>
  );
}
