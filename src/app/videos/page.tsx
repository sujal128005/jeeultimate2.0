import type { Metadata } from "next";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { JourneyLinks } from "@/components/journey/JourneyLinks";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { VideoStage } from "@/components/videos/VideoStage";
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

      <Container size="wide" className="relative pt-[104px] pb-8 md:pt-[124px]">
        <AnimatedSection className="flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 type-meta shadow-hairline">
              <span className="size-1.5 rounded-full bg-[#ff0033]" />
              Straight from our channel
            </span>
            <h1 className="mt-4 type-h2">Watch it, then do it.</h1>
          </div>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-5 type-button shadow-hairline transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
          >
            Open the channel
            <Icon name="arrow-up-right" className="size-4" />
          </a>
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
          <Container size="wide" className="relative">
            <VideoStage long={long} shorts={shorts} />
          </Container>

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
