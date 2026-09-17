import type { Metadata } from "next";
import { ComingSoon } from "@/components/placeholder/ComingSoon";
import { sectionPages } from "@/data/sections";

const page = sectionPages["college-lists"];

export const metadata: Metadata = {
  title: page.eyebrow,
  description: page.description,
  alternates: { canonical: page.href },
};

export default function CollegeListsPage() {
  return <ComingSoon page={page} />;
}
