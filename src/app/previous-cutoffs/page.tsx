import type { Metadata } from "next";
import { ComingSoon } from "@/components/placeholder/ComingSoon";
import { sectionPages } from "@/data/sections";

const page = sectionPages["previous-cutoffs"];

export const metadata: Metadata = {
  title: page.eyebrow,
  description: page.description,
  alternates: { canonical: page.href },
};

export default function PreviousCutoffsPage() {
  return <ComingSoon page={page} />;
}
