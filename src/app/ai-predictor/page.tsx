import type { Metadata } from "next";
import { JourneyContext } from "@/components/journey/JourneyContext";
import { JourneyLinks } from "@/components/journey/JourneyLinks";
import { ComingSoon } from "@/components/placeholder/ComingSoon";
import { sectionPages } from "@/data/sections";

const page = sectionPages["ai-predictor"];

export const metadata: Metadata = {
  title: page.eyebrow,
  description: page.description,
  alternates: { canonical: page.href },
};

export default async function AiPredictorPage(props: PageProps<"/ai-predictor">) {
  const search = await props.searchParams;
  return (
    <ComingSoon page={page}>
      <JourneyContext search={search} tool="The predictor" />
      <JourneyLinks current="predictor" className="[&_ol]:lg:grid-cols-2" />
    </ComingSoon>
  );
}
