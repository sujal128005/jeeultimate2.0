import type { Metadata } from "next";
import { JourneyContext } from "@/components/journey/JourneyContext";
import { JourneyLinks } from "@/components/journey/JourneyLinks";
import { ComingSoon } from "@/components/placeholder/ComingSoon";
import { sectionPages } from "@/data/sections";

const page = sectionPages["previous-cutoffs"];

export const metadata: Metadata = {
  title: page.eyebrow,
  description: page.description,
  alternates: { canonical: page.href },
};

export default async function PreviousCutoffsPage(props: PageProps<"/previous-cutoffs">) {
  const search = await props.searchParams;
  return (
    <ComingSoon page={page}>
      <JourneyContext search={search} tool="The cutoff explorer" />
      <JourneyLinks current="cutoffs" className="[&_ol]:lg:grid-cols-2" />
    </ComingSoon>
  );
}
